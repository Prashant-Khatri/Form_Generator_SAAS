import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/Mode-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const layout=({children}:{children : React.ReactNode})=>{
    return (
        <div>
            <div className="border-b">
                <nav className="flex items-center justify-between max-w-7xl mx-auto py-2">
                    <Logo/>
                    <div className="flex items-center gap-2">
                        <Button variant={"link"}>Dashboard</Button>
                        <UserButton/>
                        <ModeToggle/>
                    </div>
                </nav>
            </div>
            {children}
        </div>
    )
}

export default layout