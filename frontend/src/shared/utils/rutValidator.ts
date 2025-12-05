// Función simple para validar formato de RUT Chileno
export const validateRut = (rut: string): boolean => {
    if (!rut) return false;
    // Regex simple: Números, guion y dígito verificador (0-9 o K)
    const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
    return rutRegex.test(rut);
    // Aquí podrías agregar la lógica matemática de módulo 11 si quieres ser estricto
};