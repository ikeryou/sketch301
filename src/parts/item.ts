import vt from '../glsl/base.vert';
import fg from '../glsl/item.frag';
import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { Util } from "../libs/util";
import { DoubleSide } from 'three/src/constants';
import { UniformsUtils } from 'three/src/renderers/shaders/UniformsUtils';
import { UniformsLib } from 'three/src/renderers/shaders/UniformsLib';
import { RawShaderMaterial } from 'three/src/materials/RawShaderMaterial';
import { Conf } from '../core/conf';
import { Color } from 'three';
import { HSL } from '../libs/hsl';


export class Item extends MyObject3D {

  private _meshA:Mesh;
  private _col:Color;

  constructor(opt:any = {}) {
    super()

    this._col = opt.col == undefined ? Util.instance.randomArr(Conf.instance.COLOR).clone() : opt.col;

    const light = opt.lightCol.clone();
    const hsl = new HSL();
    light.getHSL(hsl);
    light.l *= 0.8;
    light.setHSL(hsl.h, hsl.s, hsl.l);

    const uni = {
      color:{value:opt.isLast ? new Color(0x000000) : this._col},
      light:{value:light},
      rate:{value:0},
      glossiness:{value:4},
      test:{value:opt.test},
    }

    const mat = new RawShaderMaterial({
      vertexShader:vt,
      fragmentShader:fg,
      transparent:true,
      side:DoubleSide,
      lights:true,
      depthTest:true,
      uniforms:UniformsUtils.merge([
        UniformsLib.lights,
        uni,
      ])
    });

    this._meshA = new Mesh(opt.geo, mat);
    this.add(this._meshA);
  }


  public getCol():Color {
    return this._col;
  }


  protected _update():void {
    super._update();
  }


  protected _resize(): void {
    super._resize();
  }
}