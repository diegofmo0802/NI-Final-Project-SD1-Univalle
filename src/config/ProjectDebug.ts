import { Debug } from "saml.servercore";

Debug.showAll = true;

export const warning = Debug.getInstance('__warning', '.debug', true, true);
export const error = Debug.getInstance('__error', '.debug', true, true);
export const log = Debug.getInstance();

export class ProjectDebug {
    public static log(...args: any[]) { log.log(...args); }
    public static warn(...args: any[]) { warning.log(...args); }
    public static error(...args: any[]) { error.log(...args); }
};
export default ProjectDebug;