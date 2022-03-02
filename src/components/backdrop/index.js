import { motion, AnimatePresence } from "framer-motion"
import './index.css'
import { removeToast } from "../../util/functions"

const Backdrop = ({show, setShow, toastId}) => {
    const onClose = () => {
        setShow(false)
        removeToast(toastId)
    }

    return (
        <AnimatePresence>
            {
                show && (
                    <motion.div className="full-page backdrop" initial={{opacity: 0, animationDuration: 0.5}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={onClose}>
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}

export default Backdrop