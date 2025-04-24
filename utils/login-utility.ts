import { CommonUtility } from "./common-utility";
const commonUtility = new CommonUtility();

export class LoginUtility {

    /**
     * Retrieves user credentials by updating the provided credentials object 
     * with username and password from environment variables.
     * 
     * @param {object} credentials - The initial credentials object to update.
     * @returns {Promise<any>} - A promise that resolves to the updated credentials object containing the username and password.
     */
    async getUserCredentials(credentials: object): Promise<any> {
        return await commonUtility.updateObject(credentials, {
            'username': process.env.USERNAME,
            'password': process.env.PASSWORD,
        }, [])
    }

}
