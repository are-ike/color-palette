import { cls } from '../../util/functions'
import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({classNames, color = '#000', isFullpage = true}) => {
    return (
        <div className={cls(isFullpage ? 'full-page': null, classNames)}>
            <ClipLoader color={color} size={50} />
        </div>
    )
}

export default Loader