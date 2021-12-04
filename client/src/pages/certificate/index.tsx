import React from "react";
import "./index.css"

const Cert = () => {
    return <div>
        <div className="container-fluid cert-header mb-5">The History behind the jewelry</div>
        {/* <img className="w-100 cert-image mb-5" src="images/cert-image.jpg" alt="romanian-pillars"/> */}
        <img className="w-100 cert-image mb-5" loading="lazy" decoding="async" src="images/cert-image.jpg" alt="romanian-pillars"/>
        <div className="cert-text text-start container-fluid">
            <p id="cert-text-header">From the Holy Land & the Roman Glass</p>
            <p id="cert-text-body">Each piece of glass in the Holy Land is at least 2,00 years old. The glass in that jewelry was found in <strong>SAMARIA SEBASTIA, or SAMARIA HILLS</strong> and is not ordinary, transparent material. Unearthed in the Holy Land after being buried in the sand for centuries, each fragment of this Roman glass is at least 2,000 years old and can be dated to the Biblica era. Crafted in <strong>SAMARIA Hills</strong> and been used during the of Jesus, this is an artifact that has stood the test of time.<br></br> The gorgeous coloring in each piece of glass comes from the level of natural minerals and metals that were in the sand at the time which is called <strong>PATINA</strong>. For example, iron creates green tones while beautiful blue hues can be attributed to cobalt and copper. The Roman glass in the Holy Land Jewelry is set in <strong>genuine sterling silver</strong> and some of the jewelry is adorned with gemstones. More than a piece of history, the <strong>SAMARIA Crafts of the Holdy Land</strong> jewelry is: A direct link to <strong>Biblical times</strong>, and each fragment reveals a rainbow of colors when struck by light.
            </p>
            
        </div>
        <div className="container-fluid mt-5 mb-5 text-center cert-footer"><u>The Holy Land Jewelry is a stylish symbol of faith</u></div>
    </div>
}

export default Cert;