// import JSONWorker from 'url:monaco-editor/esm/vs/language/json/json.worker.js';
// import CSSWorker from 'url:monaco-editor/esm/vs/language/css/css.worker.js';
// import HTMLWorker from 'url:monaco-editor/esm/vs/language/html/html.worker.js';
// import TSWorker from 'url:monaco-editor/esm/vs/language/typescript/ts.worker.js';
import EditorWorker from 'url:monaco-editor/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';
import { editor } from 'monaco-editor';
import Color from 'color';
import { IStandaloneEditorConstructionOptions } from '../node_modules/monaco-editor/monaco.d';

declare global {
    interface Window {
        editor: editor.IStandaloneCodeEditor;
    }
}

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		// if (label === 'json') return JSONWorker;
		// if (label === 'css' || label === 'scss' || label === 'less') return CSSWorker;
		// if (label === 'html' || label === 'handlebars' || label === 'razor') return HTMLWorker;
		// if (label === 'typescript' || label === 'javascript') return TSWorker;
		return EditorWorker;
	}
};

const exampleScrap = `
    theme: {
        extend: {
            fontFamily: {
                sans: ['K2D', ...defaultTheme.fontFamily.sans],
                'madera-light': ['Madera-light', 'sans-serif'],
                'madera-regular': ['Madera-regular', 'sans-serif'],
                'madera-medium': ['Madera-medium', 'sans-serif'],
                'madera-bold': ['Madera-bold', 'sans-serif']
            },
            colors:{
                'aaron': {
                    '50':  'rgb(236, 245, 255)',
                    '100': 'rgba(221, 236, 255, 1)',
                    '200': '#c1d',
                    '300': '#9cc2ffAa',
                    '400': '#00B',
                    '500': '#5866CF',
                    '600': '#4654BE',
                    '700': '#313FA7',
                    '800': '#2438af',
                    '850': '#3c4ab3',
                    '900': '#1C245F',
                    '950': '#0b0f28',
                },
                'pink': colors.pink,
                'slate': colors.slate,
                'sage': '#00b49d',
                'mwp-sage': '#91BF67',
                'forest': '#223F34',
                'petal': '#F24A7A',
                'warning': '#DF9999',
                'sofi': {
                    'grey': '#e2e8f0',
                    'blue': '#355f8d',
                    'green': '#229c88'
                }
            },
            keyframes: {
                'fade-from-bottom-50': {
                    '0%, 100%': {transform: 'translateY(50px)'},
                    '0%': {opacity: '0', transform: 'translateY(50px)'},
                    '100%': {opacity: '100', transform: 'translateY(0px)'}
                },
                'fade-from-bottom-30': {
                    '0%, 100%': {transform: 'translateY(30px)'},
                    '0%': {opacity: '0', transform: 'translateY(30px)'},
                    '100%': {opacity: '100', transform: 'translateY(0px)'}
                },
                'scale-inwards': {
                    '0%': {opacity: '0', transform: 'scale(0.5)'},
                    '100%': {opacity: '100', transform: 'scale(1)'}
                }
            },
            animation:{
                'fade-from-bottom-50': 'fade-from-bottom-50 1s ease-in 0s 1 normal forwards',
                'fade-from-bottom-30': 'fade-from-bottom-30 1.5s ease-in 0s 1 normal forwards',
                'scale-inwards': 'scale-inwards 1.5s ease-in 0s 1 normal forwards'
            },
            screens: {
                '3xl': '1537px',
                ...defaultTheme.screens
            }
        },
    },

    plugins: [forms, typography],
};

`;

const editorElement: HTMLElement|null = document.getElementById('editor');
if (editorElement == null) throw new Error('There is no editor element')

const editorConfig: IStandaloneEditorConstructionOptions = {
	value: exampleScrap,
	language: 'json',
    theme: "vs-dark",
    automaticLayout: true,
};

window.editor = monaco.editor.create(editorElement, editorConfig);

const tailwindColorMap = { red: '#e7000b', orange: '#f54a00', amber: '#e17100', yellow: '#d08700', lime: '#5ea500', green: '#00a63e', emerald: '#009966', teal: '#009689', cyan: '#0092b8', sky: '#0084d1', blue: '#155dfc', indigo: '#4f39f6', violet: '#7f22fe', purple: '#9810fa', fuchsia: '#c800de', pink: '#e60076', rose: '#ec003f', slate: '#45556c', gray: '#4a5565', zinc: '#52525c', neutral: '#525252', stone: '#57534d', black: '#000', white: '#fff' } as const;
const getRealHexFromResult = result => result.indexOf('colors.') === 0 ? tailwindColorMap[result.substring(7)] : result;

const parseColorsFromText: () => string[] = () => {
    const wholeContents = window.editor.getModel()?.getValue() ?? '';

    const regex = /((?<hex>#[A-f0-9]{3,8})|(?<rgb>rgba?\(\d{0,3},\s?\d{0,3},\s?\d{0,3}(,\s?\d{0,3}){0,1}\))|(?<tailwind>colors.(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)))/gm;
    // Adds support for web-safe named colors, but in the case of tailwind config, it may infer that key names are the colors we would like to identify. We only want to identify values
    // const regex = /((?<hex>#[A-f0-9]{3,8})|(?<rgb>rgba?\(\d{0,3},\s?\d{0,3},\s?\d{0,3}(,\s?\d{0,3}){0,1}\))|(?<tailwind>colors.(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone))|(?<safecolor>[\"|\']{1}aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|transparent|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen[\"|\']{1}))/gm;

    let matches;
    let results: string[] = [];

    while ((matches = regex.exec(wholeContents)) !== null) {
        if (matches.index === regex.lastIndex) regex.lastIndex++;
        
        matches.forEach((match, groupIndex, other) => {
            if (groupIndex === 0) results.push(match);
        });
    }

    return results;
}

const updateResults: (results: string[]) => void = results => {
    const outputElement: HTMLDivElement|null = document.querySelector('#output');
    if (outputElement == null) return;

    outputElement.innerHTML = `
        <div class="output__list">
        ${results.map(result => {
            const colorObject = Color(getRealHexFromResult(result));
            return `
                <div 
                    class="output__list__item ${colorObject.isLight() ? 'output__list__item--light' : 'output__list__item--dark'}" 
                    style="background-color: ${colorObject.hexa().toString()}"
                >
                    <div>${result}</div>
                    <div>${colorObject.hexa().toString()}</div>
                    <div>${colorObject.rgb().toString()}</div>
                    <div>${colorObject.hsl().toString()}</div>
                </div>
            `
        }).join("")}
        </div>
    `;
}

window.editor.getModel()?.onDidChangeContent(event => updateResults(parseColorsFromText()));
updateResults(parseColorsFromText())
