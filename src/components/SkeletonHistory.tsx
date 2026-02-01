import { motion } from "motion/react"

export default function SkeletonHistory({width="full"}) {
    return (
        <>
            <motion.div
                initial={{ backgroundPositionX: "200%" }}
                animate={{ backgroundPositionX: "-200%" }}
                transition={{ duration: 5, repeat: Infinity, ease:"linear" }}
                style={{ backgroundSize: "400% 100%" }}
                className={`bg-linear-to-r from-[#3f4944] via-[#015028] to-[#3f4944] rounded-md w-${width} h-6 p-1`}>
            </motion.div>
        </>
    )
}