import React from 'react';

interface props {
  url: string;
  name: string;
}

const style:object = {display: 'inline-block', color: '#b7eb8f', margin: '20px 0'}

const ToolItem = ({ url, name }:props) => <div><a style={style} rel="noopener noreferrer" href={url} target="_blank">{name}</a></div>;

export default ToolItem;
