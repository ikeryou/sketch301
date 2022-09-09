import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { Scroller } from "../core/scroller";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { Color } from 'three/src/math/Color';
import { Conf } from '../core/conf';
import { HSL } from '../libs/hsl';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { CineonToneMapping, sRGBEncoding } from 'three/src/constants';
import { ItemWrapper } from './itemWrapper';

export class Visual extends Canvas {

  private _con:Object3D;
  private _item:Array<ItemWrapper> = [];
  private _bgColor:Color = new Color();
  private _light:DirectionalLight;

  constructor(opt: any) {
    super(opt);

    this._light = new DirectionalLight(Util.instance.randomArr(Conf.instance.COLOR).clone(), 0.5);
    this.mainScene.add(this._light)
    this._light.position.set(4, 4, 4);

    const ambientLight = new AmbientLight(Util.instance.randomArr(Conf.instance.COLOR).clone(), 0.5);
    this.mainScene.add(ambientLight);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    for(let i = 0; i < 30; i++) {
      const item = new ItemWrapper({
        lightCol:this._light.color,
      })
      this._con.add(item);
      this._item.push(item);
    }

    // 背景の色
    const col = Util.instance.randomArr(Conf.instance.COLOR).clone();
    const hsl = new HSL();
    col.getHSL(hsl);
    hsl.l *= 1.2;
    col.setHSL(hsl.h, hsl.s, hsl.l);
    this._bgColor = col;

    this._con.rotation.x = Util.instance.radian(45);
    this._con.rotation.y = Util.instance.radian(-45);

    Scroller.instance.set(0);
    this._resize()
  }


  protected _update(): void {
    super._update()

    // const sw = Func.instance.sw()
    const sh = Func.instance.sh()

    this._con.position.y = Func.instance.screenOffsetY() * -1

    // const mx = MousePointer.instance.easeNormal.x;
    // const my = MousePointer.instance.easeNormal.y;

    // const d = Math.min(sw, sh) * 0.15;
    // this._con.position.x = mx * d * -1;
    // this._con.position.y = my * d;

    const scrollArea = sh * 4;
    Tween.instance.set(document.querySelector('.l-height'), {
      height:scrollArea
    })

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(this._bgColor, 1)
    this.renderer.render(this.mainScene, this.cameraOrth)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    const line = 6;
    const interval2 = this._item[0].itemSize * 1.5;
    const interval = (this._item[0].itemSize + interval2);
    const xTotal = line * interval - interval2;
    const yTotal = ~~(this._item.length / line) * interval - interval2 * 2;
    this._item.forEach((val,i) => {
      const ix = i % line;
      const iy = ~~(i / line);
      val.position.x = ix * interval + val.itemSize * 0.5 - xTotal * 0.5;
      val.position.z = iy * interval - val.itemSize * 0.5 - yTotal * 0.5;
      if(iy % 2 == 0) {
        val.position.x -= interval2;
      }

      val.rotation.x = Util.instance.radian(iy % 2 == 0 ? -90 : 90);
    })

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = CineonToneMapping;
    this.renderer.toneMappingExposure = 1.75;

    if (isRender) {
      this._render();
    }
  }
}
