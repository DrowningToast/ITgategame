import styles from './Submit.module.css'

const Submit = ({ text, ClassName, noDefaultStyles}) => {

    return (
        <input 
        className={`${ClassName} ${!noDefaultStyles ? styles.inputSubmit : ""}`} 
        type="submit" 
        value={text ? text : "Submit"} 
        />
    )

}

export default Submit