import { useRouter } from "next/router";
import React from "react";

const Premium: React.FC<PremiumProps> = ({guild, title}) => {
    const router = useRouter()
    return (
        <>
            <div className="flex flex-row cursor-pointer items-center" onClick={() => router.push(`/dashboard/${guild}/premium`)}>
            <i className="fas fa-crown text-purple-500 mr-2"/><span><span className="font-bold text-purple-500">배틀이 프리미엄</span>으로 {title}</span>
            </div>
        </>
    )
}

interface PremiumProps {
    guild: string;
    title: string;
}

export default Premium;