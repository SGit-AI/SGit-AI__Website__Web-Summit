// Jose's own extra pages (the build's people/<id>/pages.mjs hook: build(ROOT) -> [{rel, title, description, body, md}],
// every rel under people/jose/). Kept by dev@web-summit.jose at Jose's word.
//   people/jose/pulse/  Jose's pulse over time (WS-41 step 2, approved by Jose on 7 November 2026, C30)
import { pulseView } from './dev/pulse-view.mjs'

export function build(ROOT) {
    return [pulseView(ROOT)]
}
