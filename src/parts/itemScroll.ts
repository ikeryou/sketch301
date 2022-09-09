import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { DoubleSide } from 'three/src/constants';
import { MeshToonMaterial } from 'three/src/materials/MeshToonMaterial';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { HSL } from "../libs/hsl";

export class itemScroll extends MyObject3D {

  private _mesh:Mesh;

  constructor(opt:any) {
    super()

    let col = opt.col;
    const hsl = new HSL();
    col.getHSL(hsl);
    hsl.l *= 1.5;
    col = col.setHSL(hsl.h, hsl.s, hsl.l);

    const geo = new PlaneGeometry(1,1);

    this._mesh = new Mesh(
      geo,
      new MeshToonMaterial({
        color: col,
        gradientMap:null,
        transparent:true,
        side:DoubleSide,
        depthTest:true,
      })
    );
    this.add(this._mesh);
  }


  protected _update():void {
    super._update();
  }


  protected _resize(): void {
    super._resize();
  }
}