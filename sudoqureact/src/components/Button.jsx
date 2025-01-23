import { motion } from "motion/react"

export function Button({ displayValue, value, onClick }) {
    return (<motion.div
        whileTap={{ backgroundColor: '#E5E1DA', transition: { duration: 0.2 } }}
        className="button"
        onClick={() => onClick(value)}
    >
        {displayValue}
    </motion.div>)
}