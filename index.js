import React, { PropTypes, cloneElement } from 'react';
import { WebView, UIManager, NativeModules } from 'react-native';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';

export default class extends WebView {

    static displayName = 'AdvancedWebView';

    static propTypes = {
        ...WebView.propTypes,
        initialJavaScript: PropTypes.string,
        keyboardDisplayRequiresUserAction: PropTypes.bool,
        allowFileAccessFromFileURLs: PropTypes.bool,
        hideAccessory: PropTypes.bool
    };

    goForward = () => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNAdvancedWebView.Commands.goForward,
            null
        );
    };

    goBack = () => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNAdvancedWebView.Commands.goBack,
            null
        );
    };

    reload = () => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNAdvancedWebView.Commands.reload,
            null
        );
    };

    stopLoading = () => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNAdvancedWebView.Commands.stopLoading,
            null
        );
    };

    postMessage = (data) => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNAdvancedWebView.Commands.postMessage,
            [String(data)]
        );
    };

    takeSnapshot = (options ?: {
        x ?: number,
        y ?: number,
        width ?: number,
        height ?: number,
        format ?: 'png' | 'jpeg',
        quality ?: number,
    }) => {
        return NativeModules.RNAdvancedWebViewManager.takeSnapshot(this.getWebViewHandle(), {...options});
    };

    injectJavaScript = (data) => {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RNAdvancedWebView.Commands.injectJavaScript,
            [data]
        );
    };

    _onLoadingError = (event: Event) => {
        event.persist(); // persist this event because we need to store it
        var {onError, onLoadEnd} = this.props;
        var result = onError && onError(event);
        onLoadEnd && onLoadEnd(event);
        console.warn('Encountered an error loading page', event.nativeEvent);

        result !== false && this.setState({
            lastErrorEvent: event.nativeEvent,
            viewState: WebViewState.ERROR
        });
    };

    onLoadingError = (event: Event) => {
        this._onLoadingError(event)
    }

    render() {
        const wrapper = super.render();
        const [webview,...children] = wrapper.props.children;
        const { hideAccessory, initialJavaScript, allowFileAccessFromFileURLs, keyboardDisplayRequiresUserAction } = this.props;

        const advancedWebview = (
            <RNAdvancedWebView
                {...webview.props}
                ref="webview"
                initialJavaScript={initialJavaScript}
                allowFileAccessFromFileURLs={allowFileAccessFromFileURLs}
                keyboardDisplayRequiresUserAction={keyboardDisplayRequiresUserAction}
                hideAccessory={hideAccessory}
            />
        );

        return cloneElement(wrapper, wrapper.props, advancedWebview, ...children);
    }
}

const RNAdvancedWebView = createReactNativeComponentClass({
    validAttributes: {
        ...UIManager.RCTWebView.validAttributes,
        initialJavaScript: true,
        allowFileAccessFromFileURLs: true,
        hideAccessory: true,
        keyboardDisplayRequiresUserAction: true
    },
    uiViewClassName: 'RNAdvancedWebView'
});
