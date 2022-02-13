import { cls } from '../../util/functions'
import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({classNames, color = '#000'}) => {
    return (
        <div className={cls('full-page', classNames)}>
            <ClipLoader color={color} size={50} />
        </div>
    )
}

export default Loader