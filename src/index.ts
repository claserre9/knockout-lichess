import page from "page";
import {renderView} from "./core/BaseViewModel";
import {AppViewModel} from "./components/AppViewModel";
import {NotFoundViewModel} from "./components/NotFoundViewModel";
import {LichessGameViewModel} from "./components/LichessGameViewModel";
import {logPathMiddleware} from "./middlewares/middlewares";

const BASE_PATH = "/";

page("*", logPathMiddleware);
page(BASE_PATH, (context) => renderView(AppViewModel, context));
page("/lichess", (context) => renderView(LichessGameViewModel, context));
page("*", () => renderView(NotFoundViewModel));

page();