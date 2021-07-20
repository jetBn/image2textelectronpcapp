import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import history  from "./utils/history";
import Loadable from 'react-loadable';

// import IndexPage from "./page/index/index.js";
// import CapturePage from "./page/capture/index.js";
const MyLoadingComponent = ({ isLoading, error }) => {
    console.log(error)
    if (isLoading) {
        return <div></div>
    }
    else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>
    }
    else {
        return null;
    }
};


// const hashHistory = createHashHistory();
const AsyncIndex = Loadable({
    loader: () => import('./page/index/index.js'),
    loading: MyLoadingComponent
});

const AsyncCapturePage = Loadable({
    loader: () => import('./page/capture/index.js'),
    loading: MyLoadingComponent
});

const AsyncLogin = Loadable({
    loader: () => import('./page/login/index.js'),
    loading: MyLoadingComponent
});

const AsyncSetting = Loadable({
    loader: () => import('./page/setting/index.js'),
    loading: MyLoadingComponent
});

const AsyncRecord = Loadable({
    loader: () => import('./page/record/index.js'),
    loading: MyLoadingComponent
});

const AsyncResult = Loadable({
    loader: () => import('./page/result/index.js'),
    loading: MyLoadingComponent
});


const AsyncAuthorize = Loadable({
    loader: () => import('./page/authorize/index.js'),
    loading: MyLoadingComponent
});

export class MainRouter extends React.Component {
    render() {
        return (
            <HashRouter history={history}>
                <Switch>
                    <Route exact path={'/'} component={AsyncIndex} />
                    <Route exact path={'/capture'} component={AsyncCapturePage} />
                    <Route exact path={'/login'} component={AsyncLogin} />
                    <Route exact path={'/setting'} component={AsyncSetting} />
                    <Route exact path={'/record'} component={AsyncRecord} />
                    <Route exact path={'/result'} component={AsyncResult} />
                    <Route exact path={'/authorize'} component={AsyncAuthorize} />
                </Switch>
            </HashRouter>
        );
    }
}
