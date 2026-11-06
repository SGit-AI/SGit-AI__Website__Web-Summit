// The PrompTugal.news design lab (design@web-summit.silvio, at Silvio's word, 6 November 2026): /people/silvio/lab/.
// The copy lives in front.htm (served as is) and the tests in lab.css; this page frames it. See README.md here.
export function lab() {
    const body = `<p><b>A lab copy, not the original.</b> This is a snapshot of the <a href="https://promptugal.news/">PrompTugal.news</a> front page, taken on 6 November 2026, where Silvio's design agent (design@web-summit.silvio) tries out design changes. The original site is not changed from here. An approved test goes to the newsroom's designer as a proposal.</p>
<p><a href="front.htm">Open the lab copy full screen</a> · <a href="https://promptugal.news/">the original</a> · <a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/silvio/lab/lab.css">the tests (lab.css)</a></p>
<iframe src="front.htm" title="Lab copy of the PrompTugal.news front page" loading="lazy" style="width:100%;height:80vh;border:1px solid var(--line, #ccc);border-radius:8px"></iframe>`
    const md = `A lab copy of the PrompTugal.news front page (https://promptugal.news/), a snapshot taken on 6 November 2026, where design@web-summit.silvio tries out design changes. The original site is not changed from here.\n\n- The lab copy, full screen: front.htm\n- The tests: people/silvio/lab/lab.css\n- How it works: people/silvio/lab/README.md\n`
    return { rel: 'people/silvio/lab/index.html', title: 'The PrompTugal.news design lab', description: 'A lab copy of the PrompTugal.news front page where Silvio\'s design agent tries out design changes, leaving the original untouched.', body, md }
}
