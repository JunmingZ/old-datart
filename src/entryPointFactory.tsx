/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'antd/dist/antd.min.css';
import 'app/assets/fonts/iconfont.css';
// 旧版本的 JavaScript 引擎可能不支持String.prototype.replaceAll这个方法, 引入 core-js 库中的 String.prototype.replaceAll 方法的兼容性实现
import 'core-js/features/string/replace-all';
import React, { Fragment } from 'react';
import 'react-app-polyfill/ie11'; // TODO(Stephen): check if need it
import 'react-app-polyfill/stable'; // 在 React 应用中引入稳定的兼容性补丁
import { Inspector } from 'react-dev-inspector';
import ReactDOM from 'react-dom';
// 通过在子组件中使用 <Helmet> 组件来更新头部信息
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { configureAppStore } from 'redux/configureStore';
import { ThemeProvider } from 'styles/theme/ThemeProvider';
import { Debugger } from 'utils/debugger';
import './locales/i18n';

export const generateEntryPoint = EntryPointComponent => {
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
  const MOUNT_NODE = document.getElementById('root') as HTMLElement;
  const store = configureAppStore();
  Debugger.instance.setEnable(IS_DEVELOPMENT);
  // Inspector 用于开发环境的调试定位；Fragment 是一个特殊的组件，它的主要作用是在不引入额外的 DOM 元素的情况下，包裹和渲染多个子元素。
  const InspectorWrapper = IS_DEVELOPMENT ? Inspector : Fragment;
  ReactDOM.render(
    <InspectorWrapper>
      <Provider store={store}>
        <ThemeProvider>
          <HelmetProvider>
            <React.StrictMode>
              <EntryPointComponent />
            </React.StrictMode>
          </HelmetProvider>
        </ThemeProvider>
      </Provider>
    </InspectorWrapper>,
    MOUNT_NODE,
  );

  // Hot reLoadable translation json files
  // module.hot 是 webpack 提供的一个接口，用于实现热模块替换（Hot Module Replacement）功能。
  if (module.hot) {
    module.hot.accept(['./locales/i18n'], () => {
      // No need to render the App again because i18next works with the hooks
    });
  }

  // 这段代码的意义是在生产环境下，禁用 React 开发者工具的注入，以提高应用的性能和安全性。
  if (!IS_DEVELOPMENT) {
    // __REACT_DEVTOOLS_GLOBAL_HOOK__ 是 React 开发者工具提供的一个全局变量，它是 React DevTools 库中的一个重要对象
    if (typeof (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => void 0;
    }
  }
};
