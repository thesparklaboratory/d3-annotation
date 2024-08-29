import badge from "../src/Subject/badge"

describe("Subject badge", () => {
  it("renders", () => {
    badge({})
  })

  it("gives back the positioning", () => {
    const position = badge({})
    const badgeObject = {
      components: [
        {
          attrs: {
            d: "M0,0L0,0L0,0L0,0",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px"
          },
          classID: undefined,
          className: "subject-pointer",
          data: [[0, 0], [0, 0], [0, 0], [0, 0]],
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14Z",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px",
            transform: "translate(0, 0)"
          },
          classID: undefined,
          className: "subject",
          data: { radius: 14 },
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14M0,-9.8A9.8,9.8,0,1,0,0,9.8A9.8,9.8,0,1,0,0,-9.8Z",
            fill: "white",
            "stroke-width": "3px",
            transform: "translate(0, 0)"
          },
          classID: undefined,
          className: "subject-ring",
          data: { innerRadius: 9.799999999999999, outerRadius: 14 },
          type: "path"
        },
        undefined
      ],
      handles: []
    }

    expect(position).toEqual(badgeObject)
  })

  it("gives back the positioning, top", () => {
    //should abstract out subjectData and noteData
    const position = badge({ subjectData: { y: "top" } })
    const badgeObject = {
      components: [
        {
          attrs: {
            d:
              "M0,0L9.899,-9.899L-9.899,-9.899L0,0",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px"
          },
          classID: undefined,
          className: "subject-pointer",
          data: [
            [0, 0],
            [9.899494936611665, -9.899494936611664],
            [-9.899494936611665, -9.899494936611664],
            [0, 0]
          ],
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14Z",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px",
            transform: "translate(0, -19.79898987322333)"
          },
          classID: undefined,
          className: "subject",
          data: { radius: 14 },
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14M0,-9.8A9.8,9.8,0,1,0,0,9.8A9.8,9.8,0,1,0,0,-9.8Z",
            fill: "white",
            "stroke-width": "3px",
            transform: "translate(0, -19.79898987322333)"
          },
          classID: undefined,
          className: "subject-ring",
          data: { innerRadius: 9.799999999999999, outerRadius: 14 },
          type: "path"
        },
        undefined
      ],
      handles: []
    }

    expect(position).toEqual(badgeObject)
  })

  it("gives back the positioning, right", () => {
    //should abstract out subjectData and noteData
    const position = badge({ subjectData: { x: "right" } })
    const badgeObject = {
      components: [
        {
          attrs: {
            d:
              "M0,0L9.899,9.899L9.899,-9.899L0,0",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px"
          },
          classID: undefined,
          className: "subject-pointer",
          data: [
            [0, 0],
            [9.899494936611664, 9.899494936611665],
            [9.899494936611664, -9.899494936611665],
            [0, 0]
          ],
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14Z",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px",
            transform: "translate(19.79898987322333, 0)"
          },
          classID: undefined,
          className: "subject",
          data: { radius: 14 },
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14M0,-9.8A9.8,9.8,0,1,0,0,9.8A9.8,9.8,0,1,0,0,-9.8Z",
            fill: "white",
            "stroke-width": "3px",
            transform: "translate(19.79898987322333, 0)"
          },
          classID: undefined,
          className: "subject-ring",
          data: { innerRadius: 9.799999999999999, outerRadius: 14 },
          type: "path"
        },
        undefined
      ],
      handles: []
    }

    expect(position).toEqual(badgeObject)
  })

  it("gives back, top right ", () => {
    const position = badge({ subjectData: { x: "right", y: "top" } })

    const badgeObject = {
      components: [
        {
          attrs: {
            d: "M0,0L14,0L0,-14L0,0",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px"
          },
          classID: undefined,
          className: "subject-pointer",
          data: [[0, 0], [14, 0], [0, -14], [0, 0]],
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14Z",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px",
            transform: "translate(14, -14)"
          },
          classID: undefined,
          className: "subject",
          data: { radius: 14 },
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14M0,-9.8A9.8,9.8,0,1,0,0,9.8A9.8,9.8,0,1,0,0,-9.8Z",
            fill: "white",
            "stroke-width": "3px",
            transform: "translate(14, -14)"
          },
          classID: undefined,
          className: "subject-ring",
          data: { innerRadius: 9.799999999999999, outerRadius: 14 },
          type: "path"
        },
        undefined
      ],
      handles: []
    }

    expect(position).toEqual(badgeObject)
  })
  it("gives back, bottom right ", () => {
    const position = badge({ subjectData: { x: "right", y: "bottom" } })

    const badgeObject = {
      components: [
        {
          attrs: {
            d: "M0,0L14,0L0,14L0,0",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px"
          },
          classID: undefined,
          className: "subject-pointer",
          data: [[0, 0], [14, 0], [0, 14], [0, 0]],
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14Z",
            fill: undefined,
            "stroke-linecap": "round",
            "stroke-width": "3px",
            transform: "translate(14, 14)"
          },
          classID: undefined,
          className: "subject",
          data: { radius: 14 },
          type: "path"
        },
        {
          attrs: {
            d:
              "M0,-14A14,14,0,1,1,0,14A14,14,0,1,1,0,-14M0,-9.8A9.8,9.8,0,1,0,0,9.8A9.8,9.8,0,1,0,0,-9.8Z",
            fill: "white",
            "stroke-width": "3px",
            transform: "translate(14, 14)"
          },
          classID: undefined,
          className: "subject-ring",
          data: { innerRadius: 9.799999999999999, outerRadius: 14 },
          type: "path"
        },
        undefined
      ],
      handles: []
    }

    expect(position).toEqual(badgeObject)
  })
})
