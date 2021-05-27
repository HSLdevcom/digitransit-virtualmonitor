
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