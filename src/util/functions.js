import { toast } from 'react-toastify'

export const fileKey = "color-palette-files"

export const cls = (...classes) => {
	return classes.join(" ")
}

export const generateRandomHexColor = () => {
	let hex = '#'
	for(let i = 0; i < 6; i++){
		hex += Math.floor( Math.random() * 15 ).toString(16)
	}
	return hex
}

export const removeToast = (toastId) => {
	if(toastId && document.contains(document.getElementById(toastId))){
		toast.dismiss(toastId)
	}
}