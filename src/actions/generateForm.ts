"use server"

import {prisma} from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import z from "zod"
import { google } from '@ai-sdk/google';
import {generateObject, generateText} from 'ai';
import { revalidatePath } from "next/cache";

export const generateForm=async(prevState:unknown,formData : FormData)=>{
    try {
        const user=await currentUser()
        if(!user){
            return {success : false,message : "User not found"}
        }
        //define the schema
        const formDataSchema=z.object({
            description : z.string().min(1,"Description is required")
        })
        const result=formDataSchema.safeParse({
            description : formData.get("description") as string
        })
        if(!result.success){
            return {success : false,message : "Invalid form data",error : result.error.message};
        }
        const description=result.data.description
        if(!process.env.GOOGLE_GENERATIVE_AI_API_KEY){
            return {success: false,message : "API key not found"}
        }
        const SYSTEM_PROMPT = `You are an expert Form Generator AI. Your sole purpose is to generate structured JSON form schemas based on a user's description.

            Rules & Requirements:
            1. OUTPUT FORMAT: You must return ONLY a raw JSON object. Do not include markdown formatting, code blocks, or conversational text.
            2. SCHEMA: Your JSON response must strictly adhere to this structure:
            {
                "formTitle": "string",
                "formFields": [
                {
                    "label": "string", 
                    "name": "string", 
                    "placeholder": "string" 
                }
                ]
            }
            3. KEYS: You are strictly forbidden from using any keys other than "formTitle", "formFields", "label", "name", and "placeholder".
            4. QUANTITY: The "formFields" array must always contain at least 3 fields.
            5. NAMING CONVENTION: The "name" value for each field must be in snake_case (e.g., "phone_number", "student_id") to ensure reliable code rendering.
            6. CONTENT: 
            - Analyze the user's description to generate relevant fields.
            - "formTitle" should be professional and concise.
            - "placeholder" text must be helpful and context-aware.
            `;
        const generatedFormSchema = z.object({
            formTitle: z.string().describe("The title of the form"),
            formFields: z.array(
            z.object({
                label: z.string().describe("The label to display for the field"),
                name: z.string().describe("The unique identifier for the field (snake_case)"),
                placeholder: z.string().describe("The placeholder text for the field"),
            })
            ).min(3).describe("An array of fields in the form, containing at least 3 items"),
        });
        //Request AI to generate the form content
        const {object}=await generateObject({
            model : google('gemini-2.5-flash'),
            schema : generatedFormSchema,
            system : SYSTEM_PROMPT,
            prompt : description
        })
        console.log("AI generated form object",object)
        if(!object){
            return {success : false,message : "Failed to generate form"}
        }
        const savedForm=await prisma.form.create({
            data : {
                ownerId : user.id,
                content : object
            }
        });
        revalidatePath('/dashboard/forms')
        return {success : true,message : "Form generated successfully",data : savedForm}
    } catch (error) {
        console.log("Error generating form",error)
        return {success : false,message : "Error generating form"}
    }
}