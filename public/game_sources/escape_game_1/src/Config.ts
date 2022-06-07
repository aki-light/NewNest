import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const Config = Object.freeze({
    ResourceBaseUrl: `${publicRuntimeConfig.staticFolder}/game_sources/escape_game_1/assets/`,
});

export default Config;