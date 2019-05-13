import React, { Component } from 'react';
import './index-normal.scss';
import { getArticle } from '../../api';
import hljs from '../../lib/highlight/highlight.min';
import rules from './rules';

/*
 * 已经完工的语法：
 * 标题
 * 加粗
 * 斜体
 * 中线
 * 分割线
 * 图片
 * 列表
*/

class Markdown extends Component {
  constructor(props){
    super(props);
    this.state = {
      content: '',
    };
    this.renderMarkdown = this.renderMarkdown.bind(this);
  }

  async componentDidMount(){
    const { id } = this.props;
    const res = await getArticle(id);
    const content = this.renderMarkdown(res.data);
    this.setState({ content });
    hljs.initHighlightingOnLoad();
  }

  renderMarkdown(content){
    // let result;
    // const renderSentence = (content) => {
    //   let text = content;
    //   let recursion = false;
    //   for (let i = 0; i < text.length; i += 1) {
    //     const l = text[i];
    //     const code = l.charCodeAt();
    //     const rulesCode = [35, 42, 96, 42, 45];
    //     if (rulesCode.indexOf(code) > -1) {
    //       let flag = false;
    //       for (let j = 0; j < rules.length; j += 1) {
    //         const { id } = rules[j];
    //         const { className } = rules[j];
    //         let breakFlag = false;
    //         let sentence;
    //         let transSentence;
    //         switch (id) {
    //           case 'h': {
    //             // 标题
    //             if (code === 35) {
    //               let level = 1;
    //               let plus = 0;
    //               while (text[i + level].charCodeAt() === 35) {
    //                 level += 1;
    //               }
    //               while (text[i + level + plus].charCodeAt() !== 13) {
    //                 plus += 1;
    //               }
    //               sentence = text.substr(i, level + plus + 1);
    //               breakFlag = true;
    //               transSentence = `<div class="${className + level}">${text.substr(i + level + 1, plus)}</div>`;
    //             }
    //             break;
    //           }
    //           case 'i': {
    //             // 斜体，加粗
    //             if (code === 42) {
    //               if (text[i + 1].charCodeAt() !== 42) {
    //                 let plus = 0;
    //                 while (text[i + plus].charCodeAt() !== 42) {
    //                   plus += 1;
    //                 }
    //                 sentence = text.substr(i, plus + 1);
    //                 transSentence = `<span class="md_i">${text.substr(i + 1, plus)}</span>`;
    //               } else if (text[i + 1].charCodeAt() === 42 && text[i + 2].charCodeAt() !== 42) {
    //                 let plus = 0;
    //                 while (text[i + plus].charCodeAt() !== 42) {
    //                   plus += 1;
    //                 }
    //                 sentence = text.substr(i, plus + 2);
    //                 transSentence = `<span class="md_b">${text.substr(i + 2, plus)}</span>`;
    //               } else if (text[i + 1].charCodeAt() === 42 && text[i + 2].charCodeAt() === 42 && text[i + 3].charCodeAt() !== 42) {
    //                 let plus = 0;
    //                 while (text[i + plus].charCodeAt() !== 42) {
    //                   plus += 1;
    //                 }
    //                 sentence = text.substr(i, plus + 3);
    //                 transSentence = `<span class="md_i md_b">${text.substr(i + 3, plus)}</span>`;
    //               }
    //               breakFlag = true;
    //             }
    //             break;
    //           }
    //           case 'del': {
    //             // 中线
    //             if (code === 96 && text[i + 1].charCodeAt() === 96) {
    //               let plus = 0;
    //               while (text[i + plus].charCodeAt() !== 96) {
    //                 plus += 1;
    //               }
    //               sentence = text.substr(i, plus + 2);
    //               transSentence = `<span class="${className}">${text.substr(i + 2, plus)}</span>`;
    //               breakFlag = true;
    //             }
    //             break;
    //           }
    //           case 'dividing': {
    //             // 分割线
    //             const codeArr = [42, 45];
    //             for (let x = 0; x < codeArr.length; x += 1) {
    //               const c = codeArr[x];
    //               if ((code === c && text[i + 1].charCodeAt() === c && text[i + 2].charCodeAt() === c)) {
    //                 let pluss = 0;
    //                 while (text[i + pluss].charCodeAt() === c) {
    //                   pluss += 1;
    //                 }
    //                 sentence = text.substr(i, pluss);
    //                 transSentence = `<div class="${className}"></div>`;
    //                 breakFlag = true;
    //               }
    //             }
    //             break;
    //           }
    //           default:
    //             break;
    //         }
    //         if (breakFlag) {
    //           flag = true;
    //           recursion = true;
    //           text = text.replace(sentence, transSentence);
    //           break;
    //         }
    //       }
    //       if (flag) {
    //         break;
    //       }
    //     }
    //   }
    //   if (recursion) {
    //     renderSentence(text);
    //   } else {
    //     console.log(text);
    //     result = text;
    //   }
    // };
    // renderSentence(content);
    const result = `<pre><code>${content}</code></pre>`;
    return result;
  }

  render(){
    const { content } = this.state;
    // import content from `../../../data/articles/${id}.md`
    // const content = require(`../../../data/articles/${id}.md`)
    return (
      <div dangerouslySetInnerHTML={{ __html: content }} />
    );
  }
}

export default Markdown;
