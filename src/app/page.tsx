"use client"
import Image from "next/image";
import {Button} from "@/components/ui/button";
import { motion } from "framer-motion"

export default function Home() {
    return (
        <main className="min-h-dvh grid place-items-center p-8">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <h1 className="text-3xl font-bold text-center mb-4">Longhorn Sim Racing</h1>
                <Button>Test Button</Button>
            </motion.div>
        </main>
    )
}
