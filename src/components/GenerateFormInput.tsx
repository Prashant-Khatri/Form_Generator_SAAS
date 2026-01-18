"use client"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { Sparkles } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { generateForm } from "@/actions/generateForm";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type IntialState={
    success : boolean,
    message : string,
    data? : any
}

const intialState : IntialState = {
    success : false,
    message : ""
}

const GenerateFormInput : React.FC<{text?:string}>=({text})=>{
    const [description,setDescription]=useState<string>(text || "")
    const [state,formAction]=useActionState(generateForm,intialState)
    const {pending}=useFormStatus()
    const router=useRouter()
    const changeEventHandler=(e : ChangeEvent<HTMLInputElement>)=>{
        setDescription(e.target.value)
    }
    useEffect(()=>{
        setDescription(text || "")
    },[text])
    useEffect(()=>{
        if(state.success){
            console.log("Response --->",state.data)
            toast.success(state.message)
            router.push(`/dashboard/forms/edit/${state.data.id}`)
        }else{
            toast.error(state.message)
        }
    },[state,router])
    return (
        <form action={formAction} className="flex items-center gap-4 my-8">
            <Input id="description" name="description" type="text" onChange={changeEventHandler} value={description} placeholder="Write a prompt to generate form..." required/>
            <Button className="h-12 bg-linear-to-r from-blue-500 to bg-purple-600" disabled={pending}>
                <Sparkles className="mr-2"/>
                {
                    pending ? <span>Generating form...</span> : "Generate Form"
                }
            </Button>
        </form>
    )
}

export default GenerateFormInput