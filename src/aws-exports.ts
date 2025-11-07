import { environment } from './app/environments/environment'
const awsconfig = {
                    Auth: {
                      Cognito: {
                        userPoolId: environment.userPoolId, 
                        userPoolClientId: environment.userPoolClientId, 
                      }
                    }
                  };

export default awsconfig;