import { motion, AnimatePresence } from "framer-motion"
import './index.css'

const ToastBackdrop = ({show, hide}) => {
    return (
        <AnimatePresence>
            {
                show && (
                    <motion.div className="full-page backdrop" initial={{opacity: 0, animationDuration: 0.5}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={hide}>
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}

export default ToastBackdrop