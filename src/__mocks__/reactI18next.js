/* eslint-disable */
import React from 'react';

const hasChildren = node =>
  node && (node.children || (node.props && node.props.children));

const getChildren = node =>
  node && node.children ? node.children : node.props && node.props.children;

const renderNodes = reactNodes => {
  if (typeof reactNodes === 'string') {
    return reactNodes;
  }

  return Object.keys(reactNodes).map((key, i) => {
    const child = reactNodes[key];
    const isElement = React.isValidElement(child);

    if (typeof child === 'string') {
      return child;
    }
    if (hasChildren(child)) {
      const inner = renderNodes(getChildren(child));
      return React.cloneElement(child, { ...child.props, key: i }, inner);
    }
    if (typeof child === 'object' && !isElement) {
      return Object.keys(child).reduce(
        (str, childKey) => `${str}${child[childKey]}`,
        '',
      );
    }

    return child;
  });
};

const useMock = [k => k, {}];
useMock.t = k => k;
useMock.i18n = {};

export const withTranslation = () => Component => props =>
  React.createElement(Component, { t: k => k, ...props });

export const Trans = ({ children }) =>
  Array.isArray(children) ? renderNodes(children) : renderNodes([children]);

export const Translation = ({ children }) => children(k => k, { i18n: {} });

export const useTranslation = () => useMock;

export const I18nextProvider = ({ children }) => children;

export const initReactI18next = { type: '3rdParty', init: () => {} };

export const setDefaults = () => {};
export const getDefaults = () => ({});
export const setI18n = () => {};
export const getI18n = () => ({});

export default {
  withTranslation,
  Trans,
  Translation,
  useTranslation,
  I18nextProvider,
  initReactI18next,
  setDefaults,
  getDefaults,
  setI18n,
  getI18n,
};
