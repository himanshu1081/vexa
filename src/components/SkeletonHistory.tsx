import { motion } from "motion/react"

export default function SkeletonHistory({width="full"}) {
    return (
        <>
            <motion.div
                initial={{ backgroundPositionX: "200%" }}
                animate={{ backgroundPositionX: "-200%" }}
                transition={{ duration: 1.4, repeat: Infinity, ease:"linear" }}
                style={{ backgroundSize: "400% 100%" }}
                className={`bg-linear-to-r from-[#270238] via-[#390352] to-[#270238] rounded-md w-${width} h-6 p-1`}>
            </motion.div>
        </>
    )
}