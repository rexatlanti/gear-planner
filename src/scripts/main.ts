// import '@webcomponents/webcomponentsjs/webcomponents-bundle.js'
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'

import {
    defaultItemDisplaySettings,
    GearPlanSheet,
    GearPlanTable,
    ImportSheetArea,
    NewSheetForm,
    SHARED_SET_NAME,
    SheetPickerTable
} from "./components";
import {SetExport, SheetExport} from "./geartypes";


export const contentArea = document.getElementById("content-area");
// export const midBarArea = document.getElementById("mid-controls-area");
export const topMenuArea = document.getElementById("dev-menu-area");
const editorArea = document.getElementById("editor-area");

async function initialLoad() {
    processHash();
}

let expectedHash: string[] | undefined = undefined;

function arrayEq(left: any[] | undefined, right: any[] | undefined) {
    if (left === undefined && right === undefined) {
        return true;
    }
    if (left === undefined || right === undefined) {
        return false;
    }
    if (left.length !== right.length) {
        return false;
    }
    for (let i = 0; i < left.length; i++) {
        if (left[i] !== right[i]) {
            return false;
        }
    }
    return true;
}

function setMainContent(title: string,  ...nodes) {
    contentArea.replaceChildren(...nodes);
    this.setMidBarContent();
    this.setEditorAreaContent();
}

function processHash() {
    // Remove the literal #
    const hash = (location.hash.startsWith("#") ? location.hash.substring(1) : location.hash).split('/').filter(item => item);
    console.info("processHash", hash);
    if (arrayEq(hash, expectedHash)) {
        console.info("Ignoring internal hash change")
        return;
    }
    expectedHash = hash;
    if (hash.length === 0) {
        console.info("No sheet open");
        showSheetPickerMenu();
    }
    else if (hash.length === 2 && hash[0] === "sheet") {
        const sheetKey = hash[1];
        console.log("Loading: " + sheetKey);
        openSheetByKey(sheetKey);
    }
    else if (hash[0] === "newsheet") {
        showNewSheetForm();
    }
    else if (hash[0] === "importsheet") {
        if (hash.length === 1) {
            showImportSheetForm();
        }
        else {
            // TODO this is kind of bad
            const json = hash.slice(1).join('/');
            const parsed = JSON.parse(decodeURI(json)) as SheetExport;
            const sheet = new GearPlanSheet(undefined, parsed);
            // sheet.name = SHARED_SET_NAME;
            openSheet(sheet, false);
        }
    }
    else if (hash[0] === "importset") {
        if (hash.length >= 2) {
            const json = hash.slice(1).join('/');
            const parsed = JSON.parse(decodeURI(json)) as SetExport;
            const fakeSheet: SheetExport = {
                race: undefined,
                sets: [parsed],
                // TODO: default sims
                sims: [],
                name: SHARED_SET_NAME,
                saveKey: undefined,
                job: parsed.job,
                level: parsed.level,
                partyBonus: 0,
                itemDisplaySettings: defaultItemDisplaySettings,
            }
            const sheet = new GearPlanSheet(undefined, fakeSheet);
            // sheet.name = SHARED_SET_NAME;
            openSheet(sheet, false);
        }
    }
}

export function showNewSheetForm() {
    setHash('newsheet');
    setMainContent('New Sheet', new NewSheetForm(openSheet));
}

export function showImportSheetForm() {
    setHash('importsheet')
    setMainContent('Import Sheet', new ImportSheetArea());
}

function setTitle(titlePart: string | undefined) {
    if (titlePart === undefined) {
        document.title = 'FFXIV Gear Planner';
    }
    else {
        document.title = titlePart + ' - FFXIV Gear Planner';
    }
}

function setHash(...hashParts: string[]) {
    for (let hashPart of hashParts) {
        if (hashPart === undefined) {
            console.error(new Error("Undefined url hash part!"), hashParts);
        }
    }
    expectedHash = [...hashParts];
    console.log("New hash parts", hashParts);
    location.hash = '#' + hashParts.map(part => '/' + part).join('');
    console.log(location.hash);
}

export async function openSheetByKey(sheet: string) {
    // TODO: handle nonexistent sheet
    setTitle('Loading Sheet');
    console.log('openSheetByKey: ', sheet);
    const planner = GearPlanSheet.fromSaved(sheet);
    await openSheet(planner);
    setTitle(planner.name);
}

export async function openSheet(planner: GearPlanSheet, changeHash: boolean = true) {
    setTitle('Loading Sheet');
    console.log('openSheet: ', planner.saveKey);
    document['planner'] = planner;
    if (changeHash) {
        setHash("sheet", planner.saveKey);
    }
    contentArea.replaceChildren(planner);
    const loadSheetPromise = planner.loadData().then(() => contentArea.replaceChildren(planner), (reason) => {
        console.error(reason);
        contentArea.replaceChildren(document.createTextNode("Error loading sheet!"));
    });
    await loadSheetPromise;
    setTitle(planner.name);
}

function showSheetPickerMenu() {
    setMainContent(undefined, new SheetPickerTable());
    // contentArea.replaceChildren(new SheetPickerTable());
    // setTitle(undefined);
}

function earlyUiSetup() {
    const devMenu = topMenuArea;
    const header = document.createElement("span")
    header.textContent = "Dev Menu";
    devMenu.appendChild(header);
    const nukeButton = document.createElement("button");
    nukeButton.addEventListener('click', (ev) => {
        localStorage.clear();
        setHash();
        location.reload();
    })
    nukeButton.textContent = "Nuke Local Storage";
    devMenu.appendChild(nukeButton);
}

document.addEventListener("DOMContentLoaded", () => {
    earlyUiSetup();
    addEventListener("hashchange", processHash);
    initialLoad();
})

