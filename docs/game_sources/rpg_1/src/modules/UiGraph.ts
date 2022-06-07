import UiNodeFactory from './UiNodeFactory/UiNodeFactory';
import TextFactory from './UiNodeFactory/TextFactory';
import SpriteFactory from './UiNodeFactory/SpriteFactory';
import NineSliceFactory from './UiNodeFactory/NineSliceFactory';

export default class UiGraph {
    private static cashedFactory: { [key: string]: UiNodeFactory; } = {};
    
    static getFactory(type: string): UiNodeFactory | null {
        if(!UiGraph.cashedFactory[type]) {
            let Factory;

            switch(type) {
                case 'text':
                case 'message': 
                case 'language_option_text':
                case 'credit_text': Factory = TextFactory; break;
                case 'language_option_sprite':
                case 'credit_sprite':    
                case 'sprite': Factory = SpriteFactory; break;
                case 'nine_slice': Factory = NineSliceFactory; break;
                default: break;
            }
            if(!Factory) return null;

            UiGraph.cashedFactory[type] = new Factory();
        }
         return UiGraph.cashedFactory[type];
    }
}