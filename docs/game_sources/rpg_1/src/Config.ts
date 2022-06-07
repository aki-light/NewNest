import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const Config = Object.freeze({
    ResourceBaseUrl: `${publicRuntimeConfig.staticFolder}/game_sources/rpg_1/assets/`,
});

export default Config;