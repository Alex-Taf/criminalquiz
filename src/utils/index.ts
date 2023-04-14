import { toRaw } from 'vue'
import { OBJECTIFY_MODES } from '../config/index'
import { IGetInitials, ICalculatePages, IGetEstimationColor } from './index.interface'

export const Objectify = (target: any, type: string) => {
    if (type === OBJECTIFY_MODES.JSON) return JSON.parse(JSON.stringify(target))
    if (type === OBJECTIFY_MODES.Proxy) return toRaw(target)
}

export const getInitials: IGetInitials = (words, options = { uppercase: false, dotted: false }) => {
    const splitted = words.split(' ')
    
    function getLetters(arr: Array<string>) {
        let letters = [] as Array<string>
        
        for (let i = 0; i < arr.length; i++) {
            letters.push(arr[i][0])
        }

        return letters
    }

    if (options.uppercase) {
        return splitted.length === 1 ? splitted[0][0].toUpperCase() : getLetters(splitted).join('').toUpperCase()
    }

    if (options.dotted) {
        return splitted.length === 1 ? splitted[0][0] : getLetters(splitted).join('.')
    }

    if (options.uppercase && options.dotted) {
        return splitted.length === 1 ? splitted[0][0].toUpperCase() : getLetters(splitted).join('.').toUpperCase()
    }

    if (!options.uppercase && !options.dotted) {
        return splitted.length === 1 ? splitted[0][0] : getLetters(splitted).join('')
    }
}

export const getEstimationColor: IGetEstimationColor = (estimation) => {
    switch (estimation) {
        case 2:
            return 'red'
            break;
        case 3:
            return 'orange'
            break;
        case 4:
            return 'yellow'
            break;
        case 5:
            return 'green'
            break;
        default:
            break;
    }
}

export const calculatePages: ICalculatePages = (total, perPage) => {
    return total / perPage
}

export const saveReportAs = (report: string) => {
    // It works on all HTML5 Ready browsers as it uses the download attribute of the <a> element:
    const element = document.createElement('a');
    
    //A blob is a data type that can store binary data
    // "type" is a MIME type
    // It can have a different value, based on a file you want to save
    const blob = new Blob([report], { type: 'plain/text' });

    //createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
    const fileUrl = URL.createObjectURL(blob);
    
    //setAttribute() Sets the value of an attribute on the specified element.
    element.setAttribute('href', fileUrl); //file location
    element.setAttribute('download', 'report.txt'); // file name
    element.style.display = 'none';
    
    //use appendChild() method to move an element from one element to another
    document.body.appendChild(element);
    element.click();
    
    //The removeChild() method of the Node interface removes a child node from the DOM and returns the removed node
    document.body.removeChild(element);
}

export const getFilename = (fullFilename: string): string => {
    return fullFilename.split('.')[0]
}
