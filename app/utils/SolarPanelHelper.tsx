import {SolarPanelMinimal} from '../mapper/SolarPanelMinimal';
import {SolarPanelType} from '../mapper/SolarPanelType';
import {Roof} from '../models/Roof';

export enum POSITIONED {
  LEFT,
}

export default class SolarPanelHelper {
  private static getMaximumSolarPanelsOnRoof(
    width: number,
    height: number,
    distanceBetweenPanelsCMX: number,
    distanceBetweenPanelsCMY: number,
    panelWidth: number,
    panelHeight: number,
  ): {x: number; y: number; diffX: number; diffY: number} {
    const maxX = (width - panelWidth) / (panelWidth + distanceBetweenPanelsCMX);
    const maxY =
      (height - panelHeight) / (panelHeight + distanceBetweenPanelsCMY);

    const x = Math.floor(maxX);
    const y = Math.floor(maxY);

    const diffX =
      width - x * (panelWidth + distanceBetweenPanelsCMX) - panelWidth;
    const diffY =
      height - y * (panelHeight + distanceBetweenPanelsCMY) - panelHeight;

    return {x: x + 1, y: y + 1, diffX, diffY};
  }

  static placePanelsAligned(
    panelType: SolarPanelType,
    imageSize: {width: number; height: number},
    roof: Roof,
    roofTopLeftPoint: PointInterface,
    placementHorizontal:
      | 'align-horizontal-left'
      | 'align-horizontal-center'
      | 'align-horizontal-right',
    placementVertical:
      | 'align-vertical-top'
      | 'align-vertical-center'
      | 'align-vertical-bottom',
    mode: 'horizontal' | 'vertical',
  ): SolarPanelMinimal[] {
    const oneZentimeterVertical = imageSize.height / roof.height / 100;
    const oneZentimeterHorizontal = imageSize.width / roof.width / 100;
    console.log(placementVertical);
    function relationize(value: number, isX = true) {
      if (isX) {
        return value * oneZentimeterHorizontal;
      }
      return value * oneZentimeterVertical;
    }

    const panelWidth =
      mode !== 'horizontal'
        ? relationize(panelType.width)
        : relationize(panelType.height);
    const panelHeight =
      mode !== 'horizontal'
        ? relationize(panelType.height, false)
        : relationize(panelType.width, false);

    const innerMarginX =
      relationize(roof.innerMarginLeft) + relationize(roof.innerMarginRight);
    const innerMarginY =
      relationize(roof.innerMarginTop, false) +
      relationize(roof.innerMarginBottom, false);

    const maxPanels = this.getMaximumSolarPanelsOnRoof(
      imageSize.width - innerMarginX,
      imageSize.height - innerMarginY,
      relationize(roof.distanceBetweenPanelsCM),
      relationize(roof.distanceBetweenPanelsCM, false),
      panelWidth,
      panelHeight,
    );
    const result: SolarPanelMinimal[] = [];

    for (let x = 0; x < maxPanels.x; x++) {
      for (let y = 0; y < maxPanels.y; y++) {
        let startY, startX;

        const innerMarginHalthX = relationize(roof.distanceBetweenPanelsCM / 2);
        const innerMarginX =
          panelWidth + relationize(roof.distanceBetweenPanelsCM);
        startX = roofTopLeftPoint.x - innerMarginHalthX + x * innerMarginX;

        if (placementHorizontal === 'align-horizontal-center') {
          startX += maxPanels.diffX / 2;
        }

        if (placementHorizontal === 'align-horizontal-right') {
          startX += maxPanels.diffX;
        }

        const innerMarginHalthY = relationize(
          roof.distanceBetweenPanelsCM / 2,
          false,
        );
        const innerMarginY =
          panelHeight + relationize(roof.distanceBetweenPanelsCM, false);

        startY = roofTopLeftPoint.y - innerMarginHalthY + y * innerMarginY;

        if (placementVertical === 'align-vertical-center') {
          startY += maxPanels.diffY / 2;
        }

        if (placementVertical === 'align-vertical-bottom') {
          startY += maxPanels.diffY;
        }

        result.push(new SolarPanelMinimal(panelType, startX, startY, mode));
      }
    }

    return result;
  }
}
