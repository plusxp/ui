// Libraries
import React, {FC, useMemo} from 'react'
import {
  Config,
  Table,
  DomainLabel,
  lineTransform,
  getDomainDataFromLines,
} from '@influxdata/giraffe'

// Components
import EmptyGraphMessage from 'src/shared/components/EmptyGraphMessage'

// Utils
import {useAxisTicksGenerator} from 'src/shared/utils/useAxisTicksGenerator'
import {
  useLegendOpacity,
  useLegendOrientationThreshold,
  useLegendColorizeRows,
} from 'src/shared/utils/useLegendOrientation'
import {
  useVisXDomainSettings,
  useVisYDomainSettings,
} from 'src/shared/utils/useVisDomainSettings'
import {
  getFormatter,
  geomToInterpolation,
  filterNoisyColumns,
  parseXBounds,
  parseYBounds,
  defaultXColumn,
  defaultYColumn,
} from 'src/shared/utils/vis'

import {isFlagEnabled} from 'src/shared/utils/featureFlag'

import {getAnnotation, writeAnnotation} from 'src/annotations/api'

// Constants
import {VIS_THEME, VIS_THEME_LIGHT} from 'src/shared/constants'
import {DEFAULT_LINE_COLORS} from 'src/shared/constants/graphColorPalettes'
import {INVALID_DATA_COPY} from 'src/shared/copy/cell'

// Types
import {XYViewProperties, TimeZone, TimeRange, Theme} from 'src/types'

interface Props {
  children: (config: Config) => JSX.Element
  fluxGroupKeyUnion: string[]
  timeRange?: TimeRange | null
  table: Table
  timeZone: TimeZone
  viewProperties: XYViewProperties
  theme: Theme,
  annotations?: any,
}

const XYPlot: FC<Props> = ({
  children,
  fluxGroupKeyUnion,
  timeRange,
  table,
  timeZone,
  annotations,
  viewProperties: {
    geom,
    colors,
    xColumn: storedXColumn,
    yColumn: storedYColumn,
    shadeBelow,
    hoverDimension,
    legendOpacity,
    legendOrientationThreshold,
    legendColorizeRows,
    generateXAxisTicks,
    xTotalTicks,
    xTickStart,
    xTickStep,
    generateYAxisTicks,
    yTotalTicks,
    yTickStart,
    yTickStep,
    axes: {
      x: {
        label: xAxisLabel,
        prefix: xTickPrefix,
        suffix: xTickSuffix,
        base: xTickBase,
        bounds: xBounds,
      },
      y: {
        label: yAxisLabel,
        prefix: yTickPrefix,
        suffix: yTickSuffix,
        bounds: yBounds,
        base: yTickBase,
      },
    },
    position,
    timeFormat,
  },
  theme,
}) => {
  const axisTicksOptions = useAxisTicksGenerator({
    generateXAxisTicks,
    xTotalTicks,
    xTickStart,
    xTickStep,
    generateYAxisTicks,
    yTotalTicks,
    yTickStart,
    yTickStep,
  })
  const tooltipOpacity = useLegendOpacity(legendOpacity)
  const tooltipOrientationThreshold = useLegendOrientationThreshold(
    legendOrientationThreshold
  )
  const tooltipColorize = useLegendColorizeRows(legendColorizeRows)

  const storedXDomain = useMemo(() => parseXBounds(xBounds), [xBounds])
  const storedYDomain = useMemo(() => parseYBounds(yBounds), [yBounds])
  const xColumn = storedXColumn || defaultXColumn(table, '_time')
  const yColumn =
    (table.columnKeys.includes(storedYColumn) && storedYColumn) ||
    defaultYColumn(table)

  const columnKeys = table.columnKeys

  const isValidView =
    xColumn &&
    columnKeys.includes(xColumn) &&
    yColumn &&
    columnKeys.includes(yColumn)

  const colorHexes =
    colors && colors.length
      ? colors.map(c => c.hex)
      : DEFAULT_LINE_COLORS.map(c => c.hex)

  const interpolation = geomToInterpolation(geom)

  const groupKey = [...fluxGroupKeyUnion, 'result']

  const [xDomain, onSetXDomain, onResetXDomain] = useVisXDomainSettings(
    storedXDomain,
    table.getColumn(xColumn, 'number'),
    timeRange
  )

  const memoizedYColumnData = useMemo(() => {
    if (position === 'stacked') {
      const {lineData} = lineTransform(
        table,
        xColumn,
        yColumn,
        groupKey,
        colorHexes,
        position
      )
      return getDomainDataFromLines(lineData, DomainLabel.Y)
    }
    return table.getColumn(yColumn, 'number')
  }, [table, yColumn, xColumn, position, colorHexes, groupKey])

  const [yDomain, onSetYDomain, onResetYDomain] = useVisYDomainSettings(
    storedYDomain,
    memoizedYColumnData
  )

  const legendColumns = filterNoisyColumns(
    [...groupKey, xColumn, yColumn],
    table
  )

  const xFormatter = getFormatter(table.getColumnType(xColumn), {
    prefix: xTickPrefix,
    suffix: xTickSuffix,
    base: xTickBase,
    timeZone,
    timeFormat,
  })

  const yFormatter = getFormatter(table.getColumnType(yColumn), {
    prefix: yTickPrefix,
    suffix: yTickSuffix,
    base: yTickBase,
    timeZone,
    timeFormat,
  })

  const processAnnotations = (anns) => {

    anns.forEach((annotation, index) => {
      let changed = false;
      if (!annotation.color){
        changed = true;
        annotation.color='cyan';
      }
      if (!annotation.dimension){
        annotation.dimension = 'x';
        changed = true;
      }

      if (changed){
        anns[index] = annotation
      }
    })
  }

  const makeAnnotationLayer = (anns) => {
    let annotationLayer = {}
    if (anns && anns.length) {
      //if there are no colors in the annotations, add them!

      processAnnotations(annotations)

      annotationLayer = {
        type: 'annotation',
        x: xColumn,
        y: yColumn,
        fill: groupKey,
        annotations
      }
    }
    return annotationLayer
  }

  const currentTheme = theme === 'light' ? VIS_THEME_LIGHT : VIS_THEME
//console.log('got table here...(jill-1)', table);

  const config: Config = {
    ...currentTheme,
    table,
    xAxisLabel,
    yAxisLabel,
    xDomain,
    onSetXDomain,
    onResetXDomain,
    yDomain,
    onSetYDomain,
    onResetYDomain,
    ...axisTicksOptions,
    legendColumns,
    legendOpacity: tooltipOpacity,
    legendOrientationThreshold: tooltipOrientationThreshold,
    legendColorizeRows: tooltipColorize,
    valueFormatters: {
      [xColumn]: xFormatter,
      [yColumn]: yFormatter,
    },
  }

  if (!isValidView) {
    return <EmptyGraphMessage message={INVALID_DATA_COPY} />
  }

  if (isFlagEnabled('annotations')) {
    const doubleClickHandler = plotInteraction => {
      console.log('jill2;  plot info??', plotInteraction);
      const annotationTime = new Date(plotInteraction.valueX).toISOString()
      console.log('jill2:  annotation time?', annotationTime)
      writeAnnotation([
        {
          summary: 'hi',
          start: annotationTime,
          end: annotationTime,
        },
      ]).then(response => {
        console.log("jill2:  got response from writing annotations:", response);
      })
    }

    const interactionHandlers = {
      doubleClick: doubleClickHandler,
    }

    config.interactionHandlers = interactionHandlers

    getAnnotation({stream:'default'}).then(response => {
      console.log('got annotations? (jill2)', response);
    })
  }

  const annotationLayer = makeAnnotationLayer(annotations)

  const layers = [
    {
      type: 'line',
      x: xColumn,
      y: yColumn,
      fill: groupKey,
      interpolation,
      position,
      colors: colorHexes,
      shadeBelow: !!shadeBelow,
      shadeBelowOpacity: 0.08,
      hoverDimension,
    },
    annotationLayer
  ]

  config.layers = layers

  return children(config)
}

export default XYPlot
