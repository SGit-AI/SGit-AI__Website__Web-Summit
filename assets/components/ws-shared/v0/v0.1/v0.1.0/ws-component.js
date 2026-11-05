/**
 * ws-component — SgComponent with its markup in the module: a component here is two files, <name>.js (behaviour and
 * its `static template`) and <name>.css. The site's gate treats every .html file as a page (a twin, a link to it), so
 * a component's markup does not live in a sibling .html (dashboard@web-summit.dinis, 5 November 2026).
 *
 * @module ws-component
 * @version 0.1.0
 */
import { SgComponent, SgComponentPaths } from 'https://dev.tools.sgraph.ai/components/base/v1/v1.0/v1.0.0/sg-component.js'

export class WsComponent extends SgComponent {
    static template = ''
    async loadResources() {
        if (this._resourcesLoaded) return
        const jsUrl = this.constructor.jsUrl
        const css   = await fetch(SgComponentPaths.resolve(jsUrl, this.resourceName).css).then(r => r.ok ? r.text() : '').catch(() => '')
        this.shadowRoot.innerHTML = `<style>${css}</style>\n${this.constructor.template}`
        this._resourcesLoaded = true
    }
}
