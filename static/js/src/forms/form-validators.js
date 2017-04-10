export const formValidators = {
    validateInfo(elementName, data, validators, context) {
        const element = document.querySelector(`[name=${elementName}]`);
        const validatorArray = JSON.parse(validators);

        validatorArray.forEach(validator => {
            const validatorName = validator.errorName;
            if(!this[validatorName](data)) {
                element.classList.add('form-error');
                context.errorCount += 1;
            } else {
                element.classList.remove('form-error');
                if(context.errorCount > 0) { context.errorCount -= 1; }
            }
        });
    },

    required(data) {
        return data;
    },

    min6(data) {
        return data.length >= 6;
    }
};