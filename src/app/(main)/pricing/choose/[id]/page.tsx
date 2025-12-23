"use client";

import { useParams } from "next/navigation"

export default function Page() {
    const { id } = useParams()
    return (
        <>
            <div className="w-screen h-screen justify-center items-center flex">
                Your plan id is {id}
            </div>
        </>
    )
}