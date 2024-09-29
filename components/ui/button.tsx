import React from "react";
import styles from "./button.module.css";

interface ButtonProps {
    text: string;
}

const Button: React.FC<ButtonProps> = ({text}) => {
    return (
        <a href="#" className={`${styles.button}`}>{text}</a>
    );
};


export default Button