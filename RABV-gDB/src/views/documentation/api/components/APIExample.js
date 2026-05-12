import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';


import { getPythonCode, getRubyCode, getJSCode, getJavaCode, getRCode, getPerlCode, getStyles } from 'utils/apiHelper';


const APIExample = ( { api } ) => {

    console.log(api)
    // const styles = getStyles()s

    const languageMapping = [
        {name: 'python', display_name: 'Python3'},
        // {name: 'ruby', display_name: 'Ruby'},
        {name: 'js', display_name: 'Javascript'},
        // {name: 'java', display_name: 'Java'},
        // {name: 'R', display_name: 'R'},
        // {name: 'perl', display_name: 'Perl'}
    ];


    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [activeLanguageCode, setActiveLanguageCode] = useState(getPythonCode(api));


    const changeLanguage = (language) => {
        setSelectedLanguage(language);
        if (language === 'python') {setActiveLanguageCode(getPythonCode(api))};
        if (language === 'ruby') {setActiveLanguageCode(getRubyCode(api))};
        if (language === 'js') {setActiveLanguageCode(getJSCode(api))};
        if (language === 'java') {setActiveLanguageCode(getJavaCode(api))};
        if (language === 'R') {setActiveLanguageCode(getRCode(api))};
        if (language === 'perl') {setActiveLanguageCode(getPerlCode(api))};
    
    };
    const styles = {
    codeBox: {
        background: "#1e1e1e",
        padding: "16px",
        borderRadius: "8px",
        overflowX: "auto",
    },
    pre: {
        margin: 0,
        color: "#ffffff",
        fontSize: "0.85rem",
        lineHeight: "1.5",
    }
    };

    return (

        <div className="box">
            {languageMapping.map((language) => 
                    <Button className={selectedLanguage === language.name ? 'btn-main-filled' : 'btn-api-no-outline' }
                    onClick={() => changeLanguage(language.name)}
                    value={language.name}>
                    {language.display_name}
            </Button>
            )}
            <br></br>
            <br></br>
            <div style={styles.codeBox}>
                <pre style={styles.pre}>
                    <code>{activeLanguageCode}</code>
                </pre>
            </div>
            {/* <div style={styles.codeBox} >
                <SyntaxHighlighter language={selectedLanguage} 
                                    // style={coy}
                                    showLineNumbers 
                                    codeTagProps={{ style: { fontSize: '0.8em', lineHeight: '0.2', background:'none' } }}>
                    {activeLanguageCode}

                </SyntaxHighlighter>

            </div> */}

        </div>

    )
};

export default APIExample;