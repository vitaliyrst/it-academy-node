import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'prettyJson'
})
export class PrettyJsonPipe implements PipeTransform {

    transform(value: any, args: any[]): any {
        try {
            return this.applyColors(
                typeof value === 'object' ? value : JSON.parse(value),
                args[0],
                args[1]
            );
        } catch (e) {
            return this.applyColors({error: 'Invalid JSON'}, args[0], args[1]);
        }
    }

    applyColors(obj: any, showNumberLine: boolean = false, padding: number = 4) {
        let line = 1;

        if (typeof obj != 'string') {
            obj = JSON.stringify(obj, undefined, 3);
        }

        obj = obj.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        obj = obj.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            (match: any) => {
                let themeClass = 'number';

                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        themeClass = 'key';
                    } else {
                        themeClass = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    themeClass = 'boolean';
                } else if (/null/.test(match)) {
                    themeClass = 'null';
                }

                return '<span class="' + themeClass + '">' + match + '</span>';
            }
        );

        return showNumberLine ?
            obj.replace(/^/gm, () => `<span class="number-line pl-3 select-none" >${String(line++).padEnd(padding)}</span>`) :
            obj;
    }
}
