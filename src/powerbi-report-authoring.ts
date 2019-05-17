/*
 * Important note for module augmentation:
 * Importing powerbi-client for module augmentation.
 * Don't remove it in spite of not using pbi in the file.
 * In addition, do not change to import needed classes by name.
 */
import * as pbi from 'powerbi-client';

import {
    IBaseTarget,
    IError,
    IVisualCapabilities,
    IVisualLayout,
    IVisualPropertySelector,
    IVisualPropertyValue,
} from 'powerbi-models';

import { extensions } from './extensions';
import { IVisualResponse } from './models';

/*
 * Class Augmentation/Extension Notes:
 *   - No need for export: all declarations are implicitly exported in an ambient context (inside declare)
 *   - Class augmentation of instance methods works through interface declaration merge.
 *   - Class augmentation of static methods works through namespace declaration merge.
 */

// Extend Report object
declare module 'powerbi-client' {

    // See "Class Augmentation/Extension Notes" above.
    interface Report {
        /**
         * Get a visual type capabilities
         *
         * @param visualType
         * @returns {Promise<IVisualCapabilities>}
         */
        getVisualCapabilities(visualType: string): Promise<IVisualCapabilities>;

        /**
         * Get all available visual types of a report.
         *
         * @returns {Promise<string[]>}
         */
        getAvailableVisualTypes(): Promise<string[]>;
    }
}

// Extend Page object
declare module 'powerbi-client' {
    // See "Class Augmentation/Extension Notes" above.
    interface Page {
        /**
         * Creates an empty visual of a specific type.
         *
         * IMPORTANT: Visuals which are not installed in visualization pane cannot be added.
         *            This is true for custom visuals that are not installed and native visuals that were uninstalled.
         *
         * @param visualType - The type of the visual to create.
         * @param layout – Optional. The layout which will be applied to the new visual. Default: a best effort to put a new visual in an empty space on the canvas.
         *
         * @returns {ICreateVisualResponse}
         */
        createVisual(this: Page, visualType: string, layout?: IVisualLayout): Promise<IVisualResponse>;

        /**
         * Deletes a visual by a visual name.
         *
         * @param visualName – The name of the visual to delete.
         */
        deleteVisual(this: Page, visualName: string): Promise<void>;
    }
}

// Extend Visual object
declare module 'powerbi-client' {
    // See "Class Augmentation/Extension Notes" above.
    interface VisualDescriptor {
        /**
         * Changes the visual type of an existing visual.
         *
         * @param visualType – a new visual type.
         */
       changeType(visualType: string): Promise<void>;

       /**
        * Get the visual's type capabilities
        *
        * @returns {(Promise<IVisualCapabilities>)}
        */
       getCapabilities(): Promise<IVisualCapabilities>;

       /**
        * Adds a field to a data role.
        *
        * @param dataRole - the name of the target data role.
        * @param dataField - the field to add to the data role. The field can be a column, column with aggregation, measure, hierarchy, or hierarchy with aggregation.
        */
       addDataField(dataRole: string, dataField: IBaseTarget): Promise<IError>;

       /**
        * Gets a list of fields defined in a data role.
        *
        * @param dataRole - a name of a data role.
        * @returns a list of the data role fields.
        */
       getDataFields(dataRole: string): Promise<IBaseTarget[]>;

       /**
        * Removes a data role field.
        *
        * @param dataRole - the name of the target data role.
        * @param index - the index of the enrty to delete.
        */
       removeDataField(dataRole: string, index: number): Promise<IError>;

       /**
        * Get a visual property value.
        *
        * @param selector: a selector for the property.
        * ```javascript
        * visual.getProperty(selector)
        *  .then(value => { ... });
        * ```
        *
        * @returns {(Promise<IVisualPropertyValue>)}
        */
       getProperty(selector: IVisualPropertySelector): Promise<IVisualPropertyValue>;

       /**
        * Set a visual property value.
        *
        * @param selector: a selector for the property.
        * @param value: a value to set.
        * ```javascript
        * visual.setProperty(selector)
        *  .then(() => { ... });
        * ```
        */
       setProperty(selector: IVisualPropertySelector, value: IVisualPropertyValue): Promise<void>;

       /**
        * Reset property value to default value.
        *
        * @param selector: a selector for the property.
        * ```javascript
        * visual.resetProperty(selector)
        *  .then(() => { ... });
        * ```
        */
       resetProperty(selector: IVisualPropertySelector): Promise<void>;
    }
}

export function startAuthoring(): void {
    extensions.forEach((extension) => {
        extension.initialize();
    });
}

startAuthoring();
