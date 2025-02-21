import { useState } from 'react';

const useValidation = (form_state) => {
    const [errors, setErrors] = useState({ email: [], password: [] });

    const validate = () => {
        let newErrors = { email: [], password: [] };

        // Validación de email
        if (form_state.email.length > 30) newErrors.email.push("El limite de caracteres es 30");
        if (form_state.email.length < 5) newErrors.email.push("El minimo de caracteres es 5");

        // Validación de password
        if (form_state.password.length < 5) newErrors.password.push("El minimo de caracteres es 5");

        setErrors(newErrors);
        return newErrors;
    };

    return { errors, validate };
};

export default useValidation;