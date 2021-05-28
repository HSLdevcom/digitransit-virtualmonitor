
import React from 'react';

export interface  IIconMapProps {
    color?: string,
    height?: string,
    width?: string,
    fill?: string,
    rotate?: string
}
export interface ICustomInputProps {
    color?: string,
    img: string,
    height?: number,
    width?: number,
    fill?: string,
    rotate?: string
}
const IconMap = ( style: IIconMapProps) => {
    const {color, height, width, fill, rotate } = style;
    return {
        edit: <svg width={width ? width : "24"} height={ height ? height :"24"} color={color} rotate={rotate} viewBox="0 0 24 24" fill={fill ? fill :"none"} xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.2893 17.5714L6.42729 13.7059L5 19L10.2893 17.5714Z" fill={fill ? fill : "#007AC9"} />
            <path fillRule="evenodd" clipRule="evenodd" d="M16.603 5.40339C16.3343 5.13452 15.9649 5.00006 15.6123 5.00006C15.2597 5.00006 14.8902 5.13452 14.6216 5.40339L7.36761 12.6639L11.3304 16.6303L18.5844 9.36977C19.1385 8.81518 19.1385 7.94124 18.5844 7.3866L16.603 5.40339Z" fill={fill ? fill : "#007AC9"}/>
        </svg>,
        delete: <svg width={width ? width : "24"} height={ height ? height :"24"} color={color} rotate={rotate} viewBox="0 0 24 24" fill={fill ? fill :"#888888"} xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C8.89543 1 8 1.89543 8 3V4H3C2.44772 4 2 4.44772 2 5C2 5.55228 2.44772 6 3 6H4V20C4 21.6569 5.34315 23 7 23H17C18.6569 23 20 21.6569 20 20V6H21C21.5523 6 22 5.55228 22 5C22 4.44772 21.5523 4 21 4H16V3C16 1.89543 15.1046 1 14 1H10ZM14 4H10V3H14V4ZM10 9C9.44772 9 9 9.44772 9 10V18C9 18.5523 9.44772 19 10 19C10.5523 19 11 18.5523 11 18V10C11 9.44772 10.5523 9 10 9ZM13 10C13 9.44772 13.4477 9 14 9C14.5523 9 15 9.44772 15 10V18C15 18.5523 14.5523 19 14 19C13.4477 19 13 18.5523 13 18V10Z" />
        </svg>,
        drag: <svg width={width ? width : "24"} height={ height ? height :"24"} color={color} rotate={rotate} viewBox="0 0 24 24" fill={fill ? fill :"#888888"} xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="6" r="2" />
        <circle cx="9" cy="12" r="2" />
        <circle cx="9" cy="18" r="2" />
        <circle cx="15" cy="6" r="2" />
        <circle cx="15" cy="12" r="2" />
        <circle cx="15" cy="18" r="2" />
        </svg>,
        stop: <svg width={width ? width : "32"} height={ height ? height :"32"} color={color} rotate={rotate} viewBox="0 0 32 32" fill={fill ? fill :"#007AC9"} xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5556 8.22218H8.22223V10.4444H11.5556V8.22218Z" />
        <path d="M16.0001 8.22218H12.6667V10.4444H16.0001V8.22218Z" />
        <path d="M20.4445 8.22218H17.1112V10.4444H20.4445V8.22218Z" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.8889 10.4444H21.5555V8.22218H24.3333C24.6667 8.22218 24.8889 8.44441 24.8889 8.77774V10.4444Z" />
        <path d="M24.8889 11.5555H8.22223V12.1111H24.8889V11.5555Z" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M27.6667 3.77778H5.88891C5.66669 3.11111 5.11113 2.66667 4.33335 2.66667C3.44446 2.66667 2.66669 3.44445 2.66669 4.33333V29.3333H6.00002V17.1111H27.6667C28.5556 17.1111 29.3334 16.3333 29.3334 15.4444V5.44445C29.3334 4.55556 28.5556 3.77778 27.6667 3.77778ZM26 13.2222C26 13.5556 25.7778 13.7778 25.4445 13.7778H23.7778C23.7778 14.4444 23.3334 14.8889 22.6667 14.8889C22 14.8889 21.5556 14.4444 21.5556 13.7778H11.5556C11.5556 14.4444 11.1111 14.8889 10.4445 14.8889C9.7778 14.8889 9.33335 14.4444 9.33335 13.7778H7.66669C7.33335 13.7778 7.11113 13.5556 7.11113 13.2222V7.66667C7.11113 7.33333 7.33335 7.11111 7.66669 7.11111H24.8889C25.5556 7.11111 26 7.55556 26 8.22222V13.2222Z" />
        </svg>,

    }
};
/**
 * Icon renders predefined Svg icons as react component.
 * @example
 * <Icon
 *    img="bus"       // Key of svg, required
 *    height={1}      // Height as em, optional
 *    width={1}       // Width as em, optional
 *    color="#007ac9" // Color of image, optional
 *    rotate={90}     // How many degrees to rotate image, optional
 * />
 */
const Icon = (props: ICustomInputProps) => {
    const style = {
        fill:  props.fill,
        height: props.height ? `${props.height}em` : null,
        width: props.width ? `${props.width}em` : null,
        transform: props.rotate ? `rotate(${props.rotate}deg)` : null,
    };
    const icons = IconMap(style);
    return <React.Fragment>{icons[props.img]}</React.Fragment>;
};

export default Icon;