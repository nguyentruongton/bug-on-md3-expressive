
Search for code or files
platform/frameworks/support
androidx-main
graphics/graphics-shapes/src/commonMain/kotlin/androidx/graphics/shapes/Utils.kt

Edit Code
Files
Outline
shapes
CornerRounding.kt
Cubic.kt
FeatureDetector.kt
FeatureMapping.kt
FeatureSerializer.kt
Features.kt
FloatMapping.kt
Format.kt
Morph.kt
Point.kt
PolygonMeasure.kt
PolygonValidation.kt
RoundedPolygon.kt
Shapes.kt
SvgPathParser.kt
Utils.kt
Utils.kt
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
/*
 * Copyright 2022 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

@file:JvmName("Utils")

package androidx.graphics.shapes

import kotlin.jvm.JvmName
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

/** This class has all internal methods, used by Polygon, Morph, etc. */
internal fun distance(x: Float, y: Float) = sqrt(x * x + y * y)

internal fun distanceSquared(x: Float, y: Float) = x * x + y * y

/** Returns unit vector representing the direction to this point from (0, 0) */
internal fun directionVector(x: Float, y: Float): Point {
    val d = distance(x, y)
    require(d > 0f) { "Required distance greater than zero" }
    return Point(x / d, y / d)
}

internal fun directionVector(angleRadians: Float) = Point(cos(angleRadians), sin(angleRadians))

internal fun radialToCartesian(radius: Float, angleRadians: Float, center: Point = Zero) =
    directionVector(angleRadians) * radius + center

/**
 * These epsilon values are used internally to determine when two points are the same, within some
 * reasonable roundoff error. The distance epsilon is smaller, with the intention that the roundoff
 * should not be larger than a pixel on any reasonable sized display.
 */
internal const val DistanceEpsilon = 1e-4f
internal const val AngleEpsilon = 1e-6f

/**
 * This epsilon is based on the observation that people tend to see e.g. collinearity much more
 * relaxed than what is mathematically correct. This effect is heightened on smaller displays. Use
 * this epsilon for operations that allow higher tolerances.
 */
internal const val RelaxedDistanceEpsilon = 5e-3f

internal fun Point.rotate90() = Point(-y, x)

internal val Zero = Point(0f, 0f)

internal val FloatPi = PI.toFloat()

internal val TwoPi: Float = 2 * PI.toFloat()

internal fun square(x: Float) = x * x

/** Linearly interpolate between [start] and [stop] with [fraction] fraction between them. */
internal fun interpolate(start: Float, stop: Float, fraction: Float): Float {
    return (1 - fraction) * start + fraction * stop
}

/**
 * Similar to num % mod, but ensures the result is always positive. For example: 4 % 3 =
 * positiveModulo(4, 3) = 1, but: -4 % 3 = -1 positiveModulo(-4, 3) = 2
 */
internal fun positiveModulo(num: Float, mod: Float) = (num % mod + mod) % mod

/** Returns whether C is on the line defined by the two points AB */
internal fun collinearIsh(
    aX: Float,
    aY: Float,
    bX: Float,
    bY: Float,
    cX: Float,
    cY: Float,
    tolerance: Float = DistanceEpsilon,
): Boolean {
    // The dot product of a perpendicular angle is 0. By rotating one of the vectors,
    // we save the calculations to convert the dot product to degrees afterwards.
    val ab = Point(bX - aX, bY - aY).rotate90()
    val ac = Point(cX - aX, cY - aY)
    val dotProduct = abs(ab.dotProduct(ac))
    val relativeTolerance = tolerance * ab.getDistance() * ac.getDistance()

    return dotProduct < tolerance || dotProduct < relativeTolerance
}

/**
 * Approximates whether corner at this vertex is concave or convex, based on the relationship of the
 * prev->curr/curr->next vectors.
 */
internal fun convex(previous: Point, current: Point, next: Point): Boolean {
    // TODO: b/369320447 - This is a fast, but not reliable calculation.
    return (current - previous).clockwise(next - current)
}

/*
 * Does a ternary search in [v0..v1] to find the parameter that minimizes the given function.
 * Stops when the search space size is reduced below the given tolerance.
 *
 * NTS: Does it make sense to split the function f in 2, one to generate a candidate, of a custom
 * type T (i.e. (Float) -> T), and one to evaluate it ( (T) -> Float )?
 */
internal fun findMinimum(
    v0: Float,
    v1: Float,
    tolerance: Float = 1e-3f,
    f: FindMinimumFunction,
): Float {
    var a = v0
    var b = v1
    while (b - a > tolerance) {
        val c1 = (2 * a + b) / 3
        val c2 = (2 * b + a) / 3
        if (f.invoke(c1) < f.invoke(c2)) {
            b = c2
        } else {
            a = c1
        }
    }
    return (a + b) / 2
}

/** A functional interface for computing a Float value when finding the minimum at [findMinimum]. */
internal fun interface FindMinimumFunction {
    fun invoke(value: Float): Float
}

internal const val DEBUG = false

internal inline fun debugLog(tag: String, messageFactory: () -> String) {
    // TODO: Re-implement properly when the library goes KMP using expect/actual
    if (DEBUG) {
        println("$tag: ${messageFactory()}")
    }
}
History
References
DDict Logo