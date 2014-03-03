//Namespace
var EarthServerGenericClient = EarthServerGenericClient || {};

/**
 * One slice that can be moved along it's given axis to allow subsetting of the scene.
 * @param sliceAxis - Axis of this slice.
 * @param sliceMinimum - Minimum value that the slice can become.
 * @param sliceMaximum - Maximum value that the slice can become.
 * @param startPosition - Starting value of the slice.
 * @constructor
 */
EarthServerGenericClient.Slice = function(sliceAxis,sliceMinimum,sliceMaximum,startPosition)
{
    var axis    = sliceAxis;
    var minimum = sliceMinimum;
    var maximum = sliceMaximum;
    var currentPosition = startPosition;

    /**
     * Sets the current position of the slice.
     * The function checks of the new position is valid and returns the it's current position state.
     * @param newPosition - New position to be set.
     * @returns {Number}
     */
    this.setCurrentPosition = function( newPosition )
    {
        if( newPosition >= minimum && newPosition <= maximum )
        {   currentPosition = newPosition; }

        return currentPosition;
    };

    /**
     * Returns the current position of the slice.
     * @returns {Number}
     */
    this.getCurrentPosition = function()
    {
        return currentPosition;
    };

    /**
     * Returns the current position as percentage of the slices range.
     * @returns {number}
     */
    this.getCurrentPercentage = function()
    {
        return (currentPosition - minimum) / (maximum - minimum);
    };

    /**
     * Returns the axis of the slice.
     * @returns {Number}
     */
    this.getAxis = function()
    {
        return axis;
    };

    /**
     * Returns the minimum of the slice
     */
    this.getMinimum = function()
    {   return minimum};

    /**
     * Returns the maximum of the slice
     */
    this.getMaximum = function()
    {   return maximum };

    /**
     * Returns if the current position is the minimum of the slice
     * @returns {boolean}
     */
    this.isAtMinimum = function()
    { return currentPosition === minimum;  };

    /**
     * Returns if the current position is the maximum of the slice
     * @returns {boolean}
     */
    this.isAtMaximum = function()
    {   return currentPosition === maximum;} ;
};

/**
 * Manges the slicers to allow subsetting and slicing.
 * @param xAxis
 * @param yAxis
 * @param zAxis
 * @constructor
 */
EarthServerGenericClient.SubsetManager = function(xAxis,yAxis,zAxis)
{
    var xSlices = null;
    var ySlices = null;
    var zSlices = null;
    var xTransforms = null;
    var yTransforms = null;
    var zTransforms = null;

    var box = null;
    var boxTransform = null;

    // Create slices on all axes
    if( xAxis )
    {
        xSlices = [];
        xSlices[0] = new EarthServerGenericClient.Slice(0, EarthServerGenericClient.MainScene.getCubeMinimumX(), EarthServerGenericClient.MainScene.getCubeMaximumX(),EarthServerGenericClient.MainScene.getCubeMinimumX());
        xSlices[1] = new EarthServerGenericClient.Slice(0, EarthServerGenericClient.MainScene.getCubeMinimumX(), EarthServerGenericClient.MainScene.getCubeMaximumX(),EarthServerGenericClient.MainScene.getCubeMaximumX());
    }
    if( yAxis )
    {
        ySlices = [];
        ySlices[0] = new EarthServerGenericClient.Slice(0, EarthServerGenericClient.MainScene.getCubeMinimumY(), EarthServerGenericClient.MainScene.getCubeMaximumY(),EarthServerGenericClient.MainScene.getCubeMinimumY());
        ySlices[1] = new EarthServerGenericClient.Slice(0, EarthServerGenericClient.MainScene.getCubeMinimumY(), EarthServerGenericClient.MainScene.getCubeMaximumY(),EarthServerGenericClient.MainScene.getCubeMaximumY());
    }
    if( zAxis )
    {
        zSlices = [];
        zSlices[0] = new EarthServerGenericClient.Slice(0, EarthServerGenericClient.MainScene.getCubeMinimumZ(), EarthServerGenericClient.MainScene.getCubeMaximumZ(),EarthServerGenericClient.MainScene.getCubeMinimumZ());
        zSlices[1] = new EarthServerGenericClient.Slice(0, EarthServerGenericClient.MainScene.getCubeMinimumZ(), EarthServerGenericClient.MainScene.getCubeMaximumZ(),EarthServerGenericClient.MainScene.getCubeMaximumZ());
    }

    /**
     * Returns the current values in screen space of all slices.
     * @returns {{}}
     */
    this.getWorldValues = function()
    {
        var values = {};
        
        if( xSlices !== null)
        {
            values.hasX = true;
            values.minX = xSlices[0].getCurrentPosition();
            values.maxX = xSlices[1].getCurrentPosition();
        }
        else
        {
            values.hasX = false;
            values.minX = EarthServerGenericClient.MainScene.getCubeMinimumX();
            values.maxX = EarthServerGenericClient.MainScene.getCubeMaximumX();
        }

        if( ySlices !== null)
        {
            values.hasY = true;
            values.minY = ySlices[0].getCurrentPosition();
            values.maxY = ySlices[1].getCurrentPosition();
        }
        else
        {
            values.hasY = false;
            values.minY = EarthServerGenericClient.MainScene.getCubeMinimumY();
            values.maxY = EarthServerGenericClient.MainScene.getCubeMaximumY();
        }

        if( zSlices !== null)
        {
            values.hasZ = true;
            values.minZ = zSlices[0].getCurrentPosition();
            values.maxZ = zSlices[1].getCurrentPosition();
        }
        else
        { 
            values.hasZ = false;
            values.minZ = EarthServerGenericClient.MainScene.getCubeMinimumZ();
            values.maxZ = EarthServerGenericClient.MainScene.getCubeMaximumZ();
        }
        
        return values;
    };

    /**
     * Returns the current values in cube percentages [0 - 1] of all slices.
     * @returns {{}}
     */
    this.getValues = function()
    {
        var values = {};

        if( xSlices !== null)
        {
            values.hasX = true;
            values.minX = xSlices[0].getCurrentPercentage();
            values.maxX = xSlices[1].getCurrentPercentage();
        }
        else
        {
            values.hasX = false;
            values.minX = 0.0;
            values.maxX = 1.0;
        }

        if( ySlices !== null)
        {
            values.hasY = true;
            values.minY = ySlices[0].getCurrentPercentage();
            values.maxY = ySlices[1].getCurrentPercentage();
        }
        else
        {
            values.hasY = false;
            values.minY = 0.0;
            values.maxY = 1.0;
        }

        if( zSlices !== null)
        {
            values.hasZ = true;
            values.minZ = zSlices[0].getCurrentPercentage();
            values.maxZ = zSlices[1].getCurrentPercentage();
        }
        else
        {
            values.hasZ = false;
            values.minZ = 0.0;
            values.maxZ = 1.0;
        }

        return values;
    };

    /**
     * Returns information about what to draw.
     */
    this.getDrawInformation = function()
    {
        var info = {};
        info.minX = false;
        info.maxX = false;
        info.minY = false;
        info.maxY = false;
        info.minZ = false;
        info.maxZ = false;
        info.box  = false;

        if( xSlices !== null && xSlices.length == 2 )
        {
            info.minX = !xSlices[0].isAtMinimum();
            info.maxX = !xSlices[1].isAtMaximum();
            if( info.minX && info.maxX)
            {   info.box = true;    }
        }
        if( ySlices !== null && ySlices.length == 2 )
        {
            info.minY = !ySlices[0].isAtMinimum();
            info.maxY = !ySlices[1].isAtMaximum();
            if( info.minY && info.maxY)
            {   info.box = true;    }
        }
        if( zSlices !== null && zSlices.length == 2 )
        {
            info.minZ = !zSlices[0].isAtMinimum();
            info.maxZ = !zSlices[1].isAtMaximum();
            if( info.minZ && info.maxZ)
            {   info.box = true;    }
        }
        // test if all 3 axes are active, draw a box in that case also
        if( !info.box )
        {
            if( (info.minX || info.maxX) &&
                (info.minY || info.maxY) &&
                (info.minZ || info.maxZ) )
            {
                info.box = true;
            }
        }

        return info;
    };

    /**
     * Updates the slices and the box 3dom draw status.
     */
    this.updateDraw = function()
    {
        var info = this.getDrawInformation();

        if( info.box)
        {
            boxTransform.setAttribute("render","true");

            xTransforms[0].setAttribute("render", "false");
            xTransforms[1].setAttribute("render", "false");
            yTransforms[0].setAttribute("render", "false");
            yTransforms[1].setAttribute("render", "false");
            zTransforms[0].setAttribute("render", "false");
            zTransforms[1].setAttribute("render", "false");
        }
        else // No box but some slices
        {
            boxTransform.setAttribute("render","false");

            if( xTransforms !== null && xTransforms.length == 2 )
            {
                xTransforms[0].setAttribute("render", info.minX.toString());
                xTransforms[1].setAttribute("render", info.maxX.toString());
            }
            if( yTransforms !== null && yTransforms.length == 2 )
            {
                yTransforms[0].setAttribute("render", info.minY.toString());
                yTransforms[1].setAttribute("render", info.maxY.toString());
            }
            if( zTransforms !== null && zTransforms.length == 2 )
            {
                zTransforms[0].setAttribute("render", info.minZ.toString());
                zTransforms[1].setAttribute("render", info.maxZ.toString());
            }
        }

    };

    /**
     * Updates the positions of the two slices an the given axis.
     * @param axis - Which Axis.
     * @param minValue - New value for the minimum slice.
     * @param maxValue - New value for the maximum slice.
     */
    this.updateSlicePosition = function(axis,minValue,maxValue)
    {
        var trans;

        switch(axis)
        {
            case 0: if( xSlices !== null && xSlices.length == 2 )
                    {
                        xSlices[0].setCurrentPosition( minValue );
                        xSlices[1].setCurrentPosition( maxValue );

                        trans = x3dom.fields.SFVec3f.parse( xTransforms[0].getAttribute("translation") );
                        xTransforms[0].setAttribute("translation", ""+ xSlices[0].getCurrentPosition() + " " + trans.y + " " + trans.z );
                        trans = x3dom.fields.SFVec3f.parse( xTransforms[1].getAttribute("translation") );
                        xTransforms[1].setAttribute("translation", ""+ xSlices[1].getCurrentPosition() + " " + trans.y + " " + trans.z );
                    }
                    break;
            case 1: if( ySlices !== null && ySlices.length == 2 )
                    {
                        ySlices[0].setCurrentPosition( minValue );
                        ySlices[1].setCurrentPosition( maxValue );

                        trans = x3dom.fields.SFVec3f.parse( yTransforms[0].getAttribute("translation") );
                        yTransforms[0].setAttribute("translation", ""+ trans.x + " " + ySlices[0].getCurrentPosition() +  " " + trans.z);
                        trans = x3dom.fields.SFVec3f.parse( yTransforms[1].getAttribute("translation") );
                        yTransforms[1].setAttribute("translation", ""+ trans.x + " " + ySlices[1].getCurrentPosition() +  " " + trans.z);
                    }
                    break;
            case 2: if( zSlices !== null && zSlices.length == 2 )
                    {
                        zSlices[0].setCurrentPosition( minValue );
                        zSlices[1].setCurrentPosition( maxValue );

                        trans = x3dom.fields.SFVec3f.parse( zTransforms[0].getAttribute("translation") );
                        zTransforms[0].setAttribute("translation", ""+ + trans.x + " " + trans.y + " " + zSlices[0].getCurrentPosition() );
                        trans = x3dom.fields.SFVec3f.parse( zTransforms[1].getAttribute("translation") );
                        zTransforms[1].setAttribute("translation", ""+ + trans.x + " " + trans.y + " " + zSlices[1].getCurrentPosition() );
                    }
                    break;
            default: console.log("EarthServerGenericClient:SubsetManager:updateSlicePosition: Unknown axis ", axis);
        }

        this.updateBox();
        this.updateDraw();
    };

    /**
     * Adds the slices into the x3dom scene.
     * @param domElement - The function add the slices as children to this dom element.
     */
    this.addSlicesToScene = function(domElement)
    {
        var cube = EarthServerGenericClient.MainScene.getCubeDimensions();

        if(xSlices)
        {
            xTransforms = [];
            xTransforms[0] = document.createElement("transform");
            xTransforms[0].setAttribute("translation","" + cube.minX +" 0 0");
            xTransforms[1] = document.createElement("transform");
            xTransforms[1].setAttribute("translation","" + cube.maxX +" 0 0");

            var p1 = "0 " + cube.minY + " " + cube.minZ + " ";
            var p2 = "0 " + cube.minY + " " + cube.maxZ + " ";
            var p3 = "0 " + cube.maxY + " " + cube.maxZ + " ";
            var p4 = "0 " + cube.maxY + " " + cube.minZ + " ";

            var p5 = "0 " + cube.minY + " " + cube.minZ + " ";
            var p6 = "0 " + cube.minY + " " + cube.maxZ + " ";
            var p7 = "0 " + cube.maxY + " " + cube.maxZ + " ";
            var p8 = "0 " + cube.maxY + " " + cube.minZ + " ";

            this.createOneX3DOMSlice(xTransforms[0], 0, p1, p2, p3, p4 );
            this.createOneX3DOMSlice(xTransforms[1], 1, p5, p6, p7, p8 );

            domElement.appendChild( xTransforms[0]);
            domElement.appendChild( xTransforms[1]);
        }

        if(ySlices)
        {
            yTransforms = [];
            yTransforms[0] = document.createElement("transform");
            yTransforms[0].setAttribute("translation","0 " + cube.minY +" 0");
            yTransforms[1] = document.createElement("transform");
            yTransforms[1].setAttribute("translation","0 " + cube.maxY +" 0");

            p1 = "" + cube.minX + " 0 " + cube.minZ + " ";
            p2 = "" + cube.minX + " 0 " + cube.maxZ + " ";
            p3 = "" + cube.maxX + " 0 " + cube.maxZ + " ";
            p4 = "" + cube.maxX + " 0 " + cube.minZ + " ";

            p5 = "" + cube.minX + " 0 " + cube.minZ + " ";
            p6 = "" + cube.minX + " 0 " + cube.maxZ + " ";
            p7 = "" + cube.maxX + " 0 " + cube.maxZ + " ";
            p8 = "" + cube.maxX + " 0 " + cube.minZ + " ";

            this.createOneX3DOMSlice(yTransforms[0], 3, p1, p2, p3, p4 );
            this.createOneX3DOMSlice(yTransforms[1], 4, p5, p6, p7, p8 );

            domElement.appendChild( yTransforms[0]);
            domElement.appendChild( yTransforms[1]);
        }

        if(zSlices)
        {
            zTransforms = [];
            zTransforms[0] = document.createElement("transform");
            zTransforms[0].setAttribute("translation","0 0 " + cube.minZ);
            zTransforms[1] = document.createElement("transform");
            zTransforms[1].setAttribute("translation","0 0 " + cube.maxZ);

            p1 = "" + cube.minX + " " + cube.minY + " 0 ";
            p2 = "" + cube.minX + " " + cube.maxY + " 0 ";
            p3 = "" + cube.maxX + " " + cube.maxY + " 0 ";
            p4 = "" + cube.maxX + " " + cube.minY + " 0 ";

            p5 = "" + cube.minX + " " + cube.minY + " 0 ";
            p6 = "" + cube.minX + " " + cube.maxY + " 0 ";
            p7 = "" + cube.maxX + " " + cube.maxY + " 0 ";
            p8 = "" + cube.maxX + " " + cube.minY + " 0 ";

            this.createOneX3DOMSlice(zTransforms[0], 5, p1, p2, p3, p4 );
            this.createOneX3DOMSlice(zTransforms[1], 6, p5, p6, p7, p8 );

            domElement.appendChild( zTransforms[0]);
            domElement.appendChild( zTransforms[1]);
        }

        // create BOX
        box = document.createElement("Box");
        box.setAttribute("solid","false");
        boxTransform = document.createElement("transform");
        var boxappearance = document.createElement("Appearance");
        boxappearance.setAttribute('sortType', 'transparent');
        var boxmaterial = document.createElement("Material");
        boxmaterial.setAttribute("diffuseColor","0.0 1.0 1.0");
        boxmaterial.setAttribute("transparency", "0.7");
        var boxshape = document.createElement("Shape");

        boxappearance.appendChild(boxmaterial);
        boxshape.appendChild(boxappearance);
        boxshape.appendChild(box);
        boxTransform.appendChild(boxshape);
        domElement.appendChild(boxTransform);

        boxappearance = null;
        boxmaterial = null;
        boxshape = null;

        //update box
        this.updateBox();
        this.updateDraw();
    };

    this.createOneX3DOMSlice = function(root, id, p1, p2, p3, p4 )
    {
        var appearance = document.createElement("Appearance");
        var material = document.createElement("Material");
        var shape = document.createElement("Shape");
        var TrisSet      = document.createElement("IndexedTriangleSet");
        var Coords       = document.createElement("Coordinate");
        var Points = "";

        shape.setAttribute("id","EarthServerGenericClient_SliceBase"+id);
        appearance.setAttribute('sortType', 'transparent');
        material.setAttribute("diffuseColor","1.0 0.0 0.0");
        material.setAttribute("transparency", "0.7");
        Points += ""+ p1 + " ";
        Points += ""+ p2 + " ";
        Points += ""+ p3 + " ";
        Points += ""+ p4 + " ";
        TrisSet.setAttribute("solid",'false');
        TrisSet.setAttribute("index","0 1 2 2 3 0");

        Coords.setAttribute("point", Points);
        TrisSet.appendChild(Coords);
        appearance.appendChild(material);
        shape.appendChild(appearance);
        shape.appendChild(TrisSet);
        root.appendChild(shape);

        appearance = null;
        material = null;
        shape = null;
        TrisSet = null;
        Coords = null;
    };

    this.updateBox = function()
    {
        var currentValues = this.getWorldValues();

        var boxSizeX = currentValues.maxX - currentValues.minX;
        var boxSizeY = currentValues.maxY - currentValues.minY;
        var boxSizeZ = currentValues.maxZ - currentValues.minZ;

        var transX = currentValues.minX + ( boxSizeX / 2.0);
        var transY = currentValues.minY + ( boxSizeY / 2.0);
        var transZ = currentValues.minZ + ( boxSizeZ / 2.0);

        box.setAttribute("size",""+ boxSizeX + " " + boxSizeY + " " + boxSizeZ );
        boxTransform.setAttribute("translation",""+ transX + " " + transY + " " + transZ);
    };
};