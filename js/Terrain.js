//Namespace
var EarthServerGenericClient = EarthServerGenericClient || {};

/**
 * @class Abstract base class for terrains.
 * @constructor
 */
EarthServerGenericClient.AbstractTerrain = function()
{
    /**
     * Stores the created appearances' names.
     * @type {Array}
     */
    var AppearanceDefined = [];

    /**
     * Index of the terrain. This index is the same as the index of the model the terrain belongs to.
     * @type {number}
     */
    this.index = -1;

    /**
     * Received date for this terrain.
     * @type {null}
     */
    this.data = null;

    /**
     * @ignore Empty default stub for nexFrame() function.
     */
    this.nextFrame = function()
    {};

    /**
     * @ignore Empty default stub lightUpdate() function.
     */
    this.lightUpdate = function(lightDomElement)
    {};

    /**
     * Clears the list of already defined appearances.
     */
    this.clearDefinedAppearances = function()
    {
        AppearanceDefined = [];
    };

    /**
     * Stores the IDs of the materials to change the transparency.
     * @type {Array}
     */
    this.materialNodes = [];//Stores the IDs of the materials to change the transparency.

    /**
     * Deletes all saved material IDs. Use this function if you remove old material from the dom.
     * E.g. for ProgressiveTerrain.
     */
    this.clearMaterials = function()
    {
        this.materialNodes = [];
    };

    this.getMinDataValueAtAxis = function(axis)
    {
        if( this.data)
        {
            var ret = 0;
            switch(axis)
            {
                case 0: ret = this.data.minXvalue; break;
                case 1: ret = this.data.minHMvalue; break;
                case 2: ret = this.data.minZvalue; break;
            }

            return ret;
        }
        else
        {
            console.log("EarthServerGenericClient::AbstractTerrain::getMinDataValueAtAxis(): this.data is not defined");
            return 0;
        }
    };

    /**
     * Creates a plane shape with the given appearance.
     * @param root - Node to append the transform to.
     * @param appearance - Appearance for the shape.
     * @param shapeNumber - Number of the shape (used for creating ID).
     * @param yTranslation - Translation of the plane on the y axis.
     * @returns {HTMLElement}
     */
    this.createPlaneWithMaterial = function(root, appearance, shapeNumber, yTranslation)
    {
        var shape,transform,grid, coordsNode;

        transform = document.createElement("transform");
        transform.setAttribute("translation","0 "+ yTranslation +" 0");

        shape = document.createElement('Shape');
        shape.setAttribute("id",this.index+"_shape_"+shapeNumber+"_"+0);

        coordsNode = document.createElement('Coordinate');
        coordsNode.setAttribute("point", "0 0 0 1 0 0 1 0 1 0 0 1");

        grid = document.createElement('IndexedFaceSet');
        grid.setAttribute("solid", "false");
        grid.setAttribute("colorPerVertex", "false");

        grid.setAttribute("coordIndex", "0 1 2 3 -1");
        grid.appendChild( coordsNode );

        shape.appendChild(appearance);
        shape.appendChild(grid);
        transform.appendChild(shape);

        root.appendChild(transform);

        // set vars null
        shape = null;
        grid = null;
        coordsNode = null;

        EarthServerGenericClient.MainScene.reportProgress(this.index);
        return transform;
    };

    /**
     * Creates a html canvas element out of the texture and removes the alpha values.
     * @param texture - Texture to draw. Can be everything which can be rendered into a canvas.
     * @param index - Index of the model using this canvas. Used to give the canvas a unique ID.
     * @param noData - NoData sets all pixels with the RGB value that is the same NODATA to fully transparent.
     * @param removeAlphaChannel - Flag if the alpha channel of the image should be set to be fully opaque.
     *  texture No Data Value is found in the texture.
     * @returns {HTMLElement} The canvas element.
     */
    this.createCanvas = function(texture,index,noData,removeAlphaChannel)
    {
        var canvasTmp = document.createElement('canvas');
        var checkScaledData = false;

        if( texture !== undefined && texture.width > 0 && texture.height > 0)
        {
            canvasTmp.style.display = "none";
            canvasTmp.width  = texture.width;
            canvasTmp.height = texture.height;

            var context = canvasTmp.getContext('2d');
            context.drawImage(texture, 0,0, canvasTmp.width, canvasTmp.height);

            var imageData = context.getImageData(0, 0, canvasTmp.width, canvasTmp.height);

            if(noData !== undefined && noData.length >2) // nodata RGB values are set:
            {
                checkScaledData = true;
                for (var k=0;k<imageData.data.length;k+=4)
                {
                    if(imageData.data[k] === noData[0] && imageData.data[k+1] === noData[1] && imageData.data[k+2] === noData[2])
                    {   imageData.data[k+3]=0;    } // nodata value, so set transparent
                    else
                    {   imageData.data[k+3]=255;    }// other value, so set fully opaque
                }
                context.putImageData(imageData,0,0);
            }
            if( removeAlphaChannel) // nodata is not defined: set the alpha value of all pixels to fully opaque.
            {
                for (var i=0;i<imageData.data.length;i+=4)
                {
                    imageData.data[i+3]=255;
                }
                context.putImageData(imageData,0,0);
            }

            var canvasTexture = document.createElement('canvas');
            canvasTexture.style.display = "none";
            canvasTexture.setAttribute("id", "EarthServerGenericClient_Canvas"+index);
            canvasTexture.width  = Math.pow(2, Math.round(Math.log(texture.width)  / Math.log(2)));
            canvasTexture.height = Math.pow(2, Math.round(Math.log(texture.height) / Math.log(2)));

            // Check max texture size
            var maxTextureSize = x3dom.caps.MAX_TEXTURE_SIZE;
            if( canvasTexture.width  > maxTextureSize) canvasTexture.width  = maxTextureSize;
            if( canvasTexture.height > maxTextureSize) canvasTexture.height = maxTextureSize;

            var canvasContext = canvasTexture.getContext('2d');
            canvasContext.drawImage(canvasTmp,0,0,canvasTexture.width,canvasTexture.height);

            if( checkScaledData)
            {
                var scaledContext = canvasTexture.getContext('2d');
                var scaledData = scaledContext.getImageData(0, 0, canvasTexture.width, canvasTexture.height);
                for (var o=0;o<scaledData.data.length;o+=4)
                {
                    if(scaledData.data[o+3] != 0)
                        scaledData.data[o+3]=255;
                }
                scaledContext.putImageData(scaledData,0,0);
            }

        }

        return canvasTexture;
    };

    /**
     * Returns a string with the color values in RGBA of one side.
     * @param side - Which side.
     * @param width - Desired with.
     * @param height - Desired height.
     * @returns {string} - String with RGBA color values.
     */
    this.getColorSlide = function(side,width,height)
    {
        var slide = "";
        var xPos = 0;
        var yPos = 0;
        var xSize = 1;
        var ySize = 1;

        switch(side)
        {
            case 0: ySize = this.data.texture.height;
                    break;
            case 1: xSize = this.data.texture.width;
                    break;
            case 2: xSize = this.data.texture.width;
                    yPos = this.data.texture.height -1;
                    break;
            case 3: ySize = this.data.texture.height;
                    xPos = this.data.texture.width -1;
        }

        if(this.data.texture === undefined)
        {
            console.log("EarthServerGenericClient.AbstractTerrain: No texture.")
        }
        else
        {
            var newCanvas = document.createElement("canvas");
            newCanvas.style.display = "none";
            newCanvas.width  = this.data.texture.width;
            newCanvas.height = this.data.texture.height;
            var context = newCanvas.getContext('2d');
            context.drawImage(this.data.texture, 0,0, newCanvas.width, newCanvas.height);

            var data = context.getImageData(xPos,yPos,xSize,ySize);
            var length = data.data.length;

            for(var k=0; k< length; k=k+4)
            {
                slide = slide + (data.data[k]/255) + " ";
                slide = slide + (data.data[k+1]/255) + " ";
                slide = slide + (data.data[k+2]/255) + " ";
                slide = slide + (1) + " ";

                slide = slide + (data.data[k]/255) + " ";
                slide = slide + (data.data[k+1]/255) + " ";
                slide = slide + (data.data[k+2]/255) + " ";
                slide = slide + (1) + " ";
            }
        }

        return slide;
    };

    /**
     * Function to create one side panel. Normally called by the createSidePanels():
     * @param domElement - Transform node of the model.
     * @param side - Side of the panel.
     * @param width - Number of vertices of the side panel on the x axis.
     * @param height - Number of vertices of the side panel on the z axis.
     * @param xPos - Starting position of the side panel on the x axis.
     * @param yPos - Starting position of the side panel on the z axis.
     * @param spacing - Spacing of the model's shapes.
     * @param modelTrans - Model transformation on the y axis
     * @param modelScale - Models scale on the y axis
     */
    this.createOneSidePanel = function (domElement,side,width,height,xPos,yPos,spacing,modelTrans,modelScale,imageLink)
    {
        var trans = document.createElement("transform");
        trans.setAttribute("scale","" + spacing + " 1 " + spacing);
        var shape = document.createElement('shape');
        var faceSet = document.createElement('IndexedFaceSet');
        faceSet.setAttribute("solid","false");

        var info = {};
        info.chunkWidth = width;
        info.chunkHeight = height;
        info.xpos = xPos;
        info.ypos = yPos;

        var coords = document.createElement('Coordinate');
        var textureCoords = document.createElement('TextureCoordinate');
        var index = "0 1 3 2 -1 "; // vertex index for the first quad
        var points="";
        var tc="";
        var bottom = ((-EarthServerGenericClient.MainScene.getCubeSizeY()/2.0) - parseFloat(modelTrans) ) / parseFloat(modelScale);
        var heightData = this.getHeightMap(info);
        var maxHeight = this.data.maxHMvalue;
        var app;
        var mat;
        var texture;

        console.log(width, height);

        // add vertices and indices for the quads
        for(var y=0; y<height;y++)
        {
            for(var x=0; x<width;x++)
            {
                points = points + (xPos+x) + " " + heightData[y][x] + " " + (yPos+y) +" ";
                points = points + (xPos+x) + " " + bottom + " " + (yPos+y) + " ";
                if(y+x!==0 && y+x< height+width -2)
                {
                    var mult = (x+y)*2;
                    index = index + (mult+1) + " " + mult + " " + (mult+2) + " " + (mult+3) + " -1 ";
                }

                if( imageLink )
                {
                    tc =  tc + ( (x+y) / (width+height-1 )) + " " + ( heightData[y][x] / maxHeight ) + " ";
                    tc =  tc + ( (x+y) / (width+height-1 )) + " 0 "
                }
            }
        }

        faceSet.setAttribute("coordindex",index);
        faceSet.setAttribute("lit","false");
        coords.setAttribute("point", points);
        faceSet.appendChild(coords);

        //Color or image ?
        if( imageLink )
        {
            app = document.createElement("Appearance");
            app.setAttribute('sortType', 'opaque');
            mat = document.createElement("Material");
            texture = document.createElement("ImageTexture");
            texture.setAttribute("url", imageLink );
            textureCoords.setAttribute("point", tc);
            faceSet.setAttribute("colorpervertex","false");

            faceSet.appendChild(textureCoords);
            app.appendChild(texture);
            app.appendChild(mat);
            shape.appendChild(app);
        }
        else
        {
            var color = document.createElement("colorRGBA");
            color.setAttribute("color", this.getColorSlide(side,width,height) );
            faceSet.appendChild(color);
        }

        shape.appendChild(faceSet);
        trans.appendChild(shape);
        domElement.appendChild(trans);

        trans = null;
        shape = null;
        faceSet = null;
        color = null;
        coords = null;
        index = null;
        points = null;
    };

    /**
     * Creates side panels for a models's terrain.
     * @param domElement - Transform node of the model.
     * @param spacing - The terrain's shapes spacing value.
     */
    this.createSidePanels = function(domElement,spacing,imageLinks)
    {
        if(this.data.texture === undefined) return;
        if( !imageLinks)
        {
            imageLinks = [null,null,null,null];
        }


        var modelScale = domElement.getAttribute("scale");
        modelScale = modelScale.split(" ");
        modelScale = modelScale[1];
        var modelTrans = domElement.getAttribute("translation");
        modelTrans = modelTrans.split(" ");
        modelTrans = modelTrans[1];

        this.createOneSidePanel(domElement,0,1,this.data.height,0,0,spacing,modelTrans,modelScale,imageLinks[0]);
        this.createOneSidePanel(domElement,1,this.data.width,1,0,0,spacing,modelTrans,modelScale,imageLinks[1]);
        this.createOneSidePanel(domElement,2,this.data.width,1,0,this.data.height-1,spacing,modelTrans,modelScale,imageLinks[2]);
        this.createOneSidePanel(domElement,3,1,this.data.height,this.data.width-1,0,spacing,modelTrans,modelScale,imageLinks[3]);

    };

    /**
     * Calculates the needed numbers of chunks for the terrain for a specific chunk size.
     * @param width - Width of the entire terrain.
     * @param height - Height of the entire terrain.
     * @param chunkSize - The size of one chunk.
     * @returns {} numChunksX: number, numChunksY: number, numChunks: number
     */
    this.calcNumberOfChunks = function(width,height,chunkSize)
    {
        var chunksInfo = {
            numChunksX: parseInt(width/chunkSize),
            numChunksY: parseInt(height/chunkSize),
            numChunks: 0
        };

        if(width%chunkSize!==0)
        {   chunksInfo.numChunksX++;  }


        if(height%chunkSize!==0)
        {   chunksInfo.numChunksY++;  }

        chunksInfo.numChunks = parseInt(chunksInfo.numChunksY*chunksInfo.numChunksX);
        return chunksInfo;
    };

    /**
     * This function calcs the needed information to build and place a chunk of a terrain.
     * @param index - Index of the model using the terrain. Used for creating IDs.
     * @param chunkSize - The desired size (count of values) of one chunk per axis.
     * @param chunkInfo - This parameter uses an object that will be returned by calcNumberOfChunks().
     *      It contains the information about a terrain and its chunks (e.g. number of chunks on each axis).
     * @param currentChunk - The index of the current chunk to be build.
     * @param terrainWidth - Width of the whole terrain. Used to calc texture coordinates.
     * @param terrainHeight - Height of the whole terrain. Used to calc texture coordinates.
     * @returns {}
     *      xpos: number, ypos: number, chunkWidth: number,
     *      chunkHeight: number, terrainWidth: number,
     *      terrainHeight: number, ID: number, modelIndex: number
     */
    this.createChunkInfo = function(index,chunkSize,chunkInfo,currentChunk,terrainWidth,terrainHeight)
    {
        var info = {
            xpos:parseInt(currentChunk%chunkInfo.numChunksX)*(chunkSize-1),
            ypos:parseInt(currentChunk/chunkInfo.numChunksX)*(chunkSize-1),
            chunkWidth:0,
            chunkHeight:0,
            terrainWidth: terrainWidth,
            terrainHeight: terrainHeight,
            ID: currentChunk,
            modelIndex: index
        };

        if( currentChunk%chunkInfo.numChunksX === (chunkInfo.numChunksX-1) )
        {   info.chunkWidth = terrainWidth - parseInt((chunkInfo.numChunksX-1)*(chunkSize-1));   }
        else
        {   info.chunkWidth = chunkSize;   }

        if( currentChunk >= chunkInfo.numChunks - chunkInfo.numChunksX)
        {   info.chunkHeight = terrainHeight - parseInt((chunkInfo.numChunksY-1)*(chunkSize-1)); }
        else
        {   info.chunkHeight = chunkSize  }

        return info;
    };

    /**
     * Returns a height map part from the given height map specified in the info parameter.
     * @param info - Which part of the heightmap should be returned.
     *      info.chunkHeight, info.chunkWidth, info.xpos & info.ypos
     * @returns {*}
     */
    this.getHeightMap = function(info)
    {
        try
        {
            var heightmapPart = new Array(info.chunkHeight);
            for(var i=0; i<info.chunkHeight; i++)
            {
                heightmapPart[i] = new Array(info.chunkWidth);
                for(var j=0; j<info.chunkWidth; j++)
                {
                    //If the requested position is out of bounce return the min value of the hm.
                    if(i > this.data.height || j > this.data.width || info.xpos+j < 0 || info.ypos+i <0)
                    {
                        heightmapPart[i][j] = this.data.minHMvalue;
                    }
                    else
                    {   heightmapPart[i][j] = this.data.heightmap[info.xpos+j][info.ypos+i];    }
                }
            }
            return heightmapPart;
        }
        catch(error)
        {
            console.log('AbstractTerrain::getHeightMap(): ' + error);
            return null;
        }
    };

    /**
     * Collects all material nodes of the terrain and changes each transparency attribute.
     * @param value - Transparency value between 0 (full visible) and 1 (invisible).
     */
    this.setTransparency = function(value)
    {
        for(var k=0;k<this.materialNodes.length;k++)
        {
            var mat =  document.getElementById(this.materialNodes[k]);
            if( mat !== null)
            {
                mat.setAttribute("transparency",value);
                // get parent appearance
                var app = mat.parentNode;
                if(app != null)
                {
                    if( value === 0)
                    {   app.setAttribute('sortType', 'opaque'); }
                    else
                    {   app.setAttribute('sortType', 'transparent'); }

                    // get parent shape
                    var shape = app.parentNode;
                    if( shape != null)
                    {
                        if( value == 1) // if shape is fully transparent, set rendering to false
                        {   shape.setAttribute("render","false");   }
                        else
                        {   shape.setAttribute("render","true");   }
                    }
                }
            }
            else
            {   console.log("Material with ID " +this.materialNodes[k] + " not found.");    }
        }
    };

    /**
     * Sets the number of drawn elements of the terrain.
     * The materials of the elements render flag are altered.
     * @param numberElements - Number of elements to be drawn.
     * @param focusElement - Element which has to be drawn, all other elements around this are next.
     */
    this.setDrawnElements = function(numberElements,focusElement)
    {
        var addOne =0;
        if( numberElements % 2 == 1)
        {   addOne =1; }

        var start = focusElement - parseInt(numberElements / 2)-addOne;
        var add = 0;
        if( start < 0)
        {
            add = 0 - start;
            start = 0;
        }
        var end = focusElement + parseInt(numberElements / 2) + add;
        if( end > this.materialNodes.length )
        {   end = this.materialNodes.length;  }

        for(var k=0;k<this.materialNodes.length;k++)
        {
            var mat =  document.getElementById(this.materialNodes[k]);
            if( mat !== null)
            {
                // get parent appearance
                var app = mat.parentNode;
                app = app.parentNode;
                if(k>=start && k < end)
                    app.setAttribute('render', 'true');
                else
                    app.setAttribute('render', 'false');
            }
            else
            {   console.log("Material with ID " +this.materialNodes[k] + " not found.");    }
        }
    };

    /**
     * This function handles the creation and usage of the appearances. It can be called for every shape or LOD that should use a canvasTexture.
     * It returns the amount of appearances specified. For every name only one appearance exits, every other uses it.
     * @param AppearanceName - Name of the appearance. If this name is not set in the array, it will be registered.
     *      In the case the name is already set, the existing one will be used.
     * @param AppearanceCount - Number of appearance to be created. E.g. the LODs use a bunch of three appearance nodes.
     * @param modelIndex - Index of the model using this appearance.
     * @param canvasTexture - Canvas element to be used in the appearance as texture.
     * @param transparency - Transparency of the appearance.
     * @param specular - Specular color of the appearance.
     * @param diffuse - Diffuse color of the appearance.
     * @param upright - Flag if the terrain is upright (underground data) and the texture stands upright in the cube.
     * @returns {Array} - Array of appearance nodes. If any error occurs, the function will return null.
     */
    this.getAppearances = function (AppearanceName, AppearanceCount, modelIndex, canvasTexture, transparency,specular,diffuse,upright) {
        try {
            var appearances = [AppearanceCount];
            for (var i = 0; i < AppearanceCount; i++) {
                var appearance = document.createElement('Appearance');

                if( transparency === 0)
                {   appearance.setAttribute('sortType', 'opaque'); }
                else
                {   appearance.setAttribute('sortType', 'transparent'); }

                if (AppearanceDefined[AppearanceName] != undefined)//use the already defined appearance
                {
                    appearance.setAttribute("use", AppearanceDefined[AppearanceName]);
                }
                else    //create a new appearance with the given parameter
                {
                    AppearanceDefined[AppearanceName] = AppearanceName;
                    appearance.setAttribute("id", AppearanceDefined[AppearanceName]);
                    appearance.setAttribute("def", AppearanceDefined[AppearanceName]);

                    // maybe only color
                    if( canvasTexture != undefined)
                    {
                        var texture = document.createElement('Texture');
                        texture.setAttribute('hideChildren', 'true');
                        texture.setAttribute("repeatS", 'true');
                        texture.setAttribute("repeatT", 'true');
                        texture.setAttribute("scale","false");
                        texture.appendChild(canvasTexture);

                        var imageTransform = document.createElement('TextureTransform');
                        imageTransform.setAttribute("scale", "1,-1");
                        if(upright)
                        {   imageTransform.setAttribute("rotation", "-1.57");   }
                    }

                    var material = document.createElement('material');
                    material.setAttribute("specularColor", specular);
                    material.setAttribute("diffuseColor", diffuse);
                    material.setAttribute('transparency', transparency);
                    material.setAttribute('ID',AppearanceName+"_mat");
                    //Save this material ID to change transparency during runtime
                    this.materialNodes.push( AppearanceName+"_mat");

                    appearance.appendChild(material);
                    // only add if created
                    if( canvasTexture !== undefined)
                    {
                        appearance.appendChild(imageTransform);
                        appearance.appendChild(texture);
                    }

                    texture = null;
                    imageTransform = null;
                    material = null;
                }
                appearances[i] = appearance;
            }
            return appearances;
        }
        catch (error) {
            console.log('EarthServerGenericClient::AbstractTerrain::getAppearances(): ' + error);
            return null;
        }
    };

    /**
     * Returns the Width of the Heightmap of the terrain.
     * @returns {number}
     */
    this.getHeightmapWidth = function()
    {   return this.data.width; };

    /**
     * Returns the Height of the Heightmap of the terrain.
     * @returns {number}
     */
    this.getHeightmapHeight = function()
    {   return this.data.height; };

    /**
     * Returns the elevation value of the height map at a specific point in the 3D scene.
     * All transformations and scales are considered.
     * @param xPos - Position on the x-axis.
     * @param zPos - Position on the z-axis.
     * @returns {number} - The height on the y-axis.
     */
    this.getHeightAt3DPosition = function(xPos,zPos)
    {
        var value = 0;
        var transform = document.getElementById("EarthServerGenericClient_modelTransform"+this.index);
        if(transform && this.data.heightmap)
        {
            var translations = transform.getAttribute("translation");
            translations = translations.split(" ");
            var scales = transform.getAttribute("scale");
            scales = scales.split(" ");

            var xValue = (xPos - translations[0]) / scales[0];
            var zValue = (zPos - translations[2]) / scales[2];

            value = parseFloat( this.data.heightmap[ parseInt(xValue) ][ parseInt(zValue) ] * scales[1] ) + parseFloat(translations[1]);
        }
        else
        {   console.log("AbstractTerrain::getHeightAt3DPosition: Can't find model transform for index " + this.index); }

        return value;
    };

    /**
     * Returns the dem value of the height map at a specific point in the 3D scene.
     * @param xPos - Position on the x-axis.
     * @param zPos - Position on the z-axis.
     * @returns {number} - The height of the dem.
     */
    this.getDemValueAt3DPosition = function(xPos,zPos)
    {
        var value = 0;
        var transform = document.getElementById("EarthServerGenericClient_modelTransform"+this.index);
        if(transform && this.data.heightmap)
        {
            var translations = transform.getAttribute("translation");
            translations = translations.split(" ");
            var scales = transform.getAttribute("scale");
            scales = scales.split(" ");

            var xValue = (xPos - translations[0]) / scales[0];
            var zValue = (zPos - translations[2]) / scales[2];

            value = parseFloat( this.data.heightmap[ parseInt(xValue) ][ parseInt(zValue) ] );
        }
        else
        {   console.log("AbstractTerrain::getDemValueAt3DPosition: Can't find model transform for index " + this.index); }

        return value;
    };
};





/**
 * @class This terrain should receive multiple insertLevel calls. It removes the old version
 * and replace it with the new data. It can be used for progressive loading.
 * Example: WCPSDemAlpha with progressive loading using the progressiveWCPSImageLoader.
 * @augments EarthServerGenericClient.AbstractTerrain
 * @param index - Index of the model using this terrain.
 * @constructor
 */
EarthServerGenericClient.ProgressiveTerrain = function(index)
{
    this.index = index;

    /**
     * General information about the amount of chunks needed to build the terrain.
     * @type {Object}
     */
    var chunkInfo;
    /**
     * Size of one chunk. Chunks at the borders can be smaller.
     * 256*256 (2^16) is the max size because of only 16 bit indices.
     * @type {number}
     */
    var chunkSize = 121;
    /**
     * The canvas that holds the received image.
     * @type {HTMLElement}
     */
    this.canvasTexture;
    /**
     * Counter of the inserted levels.
     * @type {number}
     */
    var currentData = 0;

    /**
     * Counter for the insertion of chunks.
     * @type {number}
     */
    var currentChunk =0;

    /**
     * Insert one data level into the scene. The old elevation grid will be removed and one new build.
     * @param root - Dom Element to append the terrain to.
     * @param data - Received Data of the Server request.
     * @param noDataValue - Array with the RGB values to be considered as no data available and shall be drawn transparent.
     * @param noDemValue - The single value in the DEM that should be considered as NODATA
     */
    this.insertLevel = function(root,data,noDataValue,noDemValue)
    {
        this.data = data;
        this.root = root;
        this.noData = noDataValue;
        this.noDemValue = noDemValue;
        this.canvasTexture = this.createCanvas(data.texture,index,noDataValue,data.removeAlphaChannel);
        chunkInfo     = this.calcNumberOfChunks(data.width,data.height,chunkSize);

        //Remove old Materials of the deleted children
        this.clearMaterials();

        for(currentChunk=0; currentChunk< chunkInfo.numChunks; currentChunk++)
        {
            EarthServerGenericClient.MainScene.enterCallbackForNextFrame( this.index );
        }
        currentChunk =0;
        currentData++;
        //chunkInfo = null;

        EarthServerGenericClient.MainScene.reportProgress(index);
    };

    /**
     * The Scene Manager calls this function after a few frames since the last insertion of a chunk.
     */
    this.nextFrame = function()
    {
        try
        {
            //Build all necessary information and values to create a chunk
            var info = this.createChunkInfo(this.index,chunkSize,chunkInfo,currentChunk,this.data.width,this.data.height);
            var hm = this.getHeightMap(info);
            var appearance = this.getAppearances("TerrainApp_"+this.index+"_"+currentData,1,
                this.index,this.canvasTexture,this.data.transparency,this.data.specularColor,this.data.diffuseColor);

            var transform = document.createElement('Transform');
            transform.setAttribute("translation", info.xpos + " 0 " + info.ypos);
            transform.setAttribute("scale", "1.0 1.0 1.0");

            if( this.noData !== undefined || this.noDemValue != undefined)
            {   new GapGrid(transform,info, hm, appearance,this.noDemValue); }
            else
            {   new ElevationGrid(transform,info, hm, appearance); }

            this.root.appendChild(transform);

            currentChunk++;
            //Delete vars avoid circular references
            info = null;
            hm = null;
            appearance = null;
            transform = null;
        }
        catch(error)
        {
            alert('Terrain::CreateNewChunk(): ' + error);
        }
    };
};
EarthServerGenericClient.ProgressiveTerrain.inheritsFrom( EarthServerGenericClient.AbstractTerrain);


/**
 * @class This terrain builds up a LOD with 3 levels of the received data.
 * @param root - Dom Element to append the terrain to.
 * @param data - Received Data of the Server request.
 * @param index - Index of the model that uses this terrain.
 * @param noDataValue - Array with the RGB values to be considered as no data available and shall be drawn transparent.
 * @param noDemValue - The single value in the DEM that should be considered as NODATA
 * @param minVertexCount - Minimum vertex count for faces to be drawn.
 * @augments EarthServerGenericClient.AbstractTerrain
 * @constructor
 */
EarthServerGenericClient.LODTerrain = function(root, data,index,noDataValue,noDemValue,minVertexCount)
{
    this.materialNodes = [];//Stores the IDs of the materials to change the transparency.
    this.data = data;
    this.index = index;
    this.noData = noDataValue;
    this.noDemValue = noDemValue;
    this.minVertexCount = minVertexCount;

    /**
     * Distance to change between full and 1/2 resolution.
     * @type {number}
     */
    var lodRange1       = 5000;
    /**
     * Distance to change between 1/2 and 1/4 resolution.
     * @type {number}
     */
    var lodRange2       = 17000;

    /**
     * The canvas that holds the received image.
     * @type {HTMLElement}
     */
    this.canvasTexture   = this.createCanvas( data.texture,index,noDataValue,data.removeAlphaChannel);

    /**
     * Size of one chunk. Chunks at the borders can be smaller.
     * We want to build 3 chunks for the LOD with different resolution but the same size on the screen.
     * With 121 values the length of the most detailed chunk is 120.
     * The second chunk has 61 values and the length of 60. With a scale of 2 it's back to the size of 120.
     * The third chunk has 31 values and the length if 30. With a scale of 4 it's also back to the size 120.
     * @type {number}
     */
    var chunkSize = 121;
    /**
     * General information about the number of chunks needed to build the terrain.
     * @type {number}
     */
    var chunkInfo       = this.calcNumberOfChunks(data.width,data.height,chunkSize);

    /**
     * Counter for the insertion of chunks.
     * @type {number}
     */
    var currentChunk    = 0;

    /**
     * Builds the terrain and appends it into the scene.
     */
    this.createTerrain= function()
    {
        for(currentChunk=0; currentChunk< chunkInfo.numChunks;currentChunk++)
        {
            EarthServerGenericClient.MainScene.enterCallbackForNextFrame( this.index );
        }
        currentChunk=0;
        //chunkInfo = null;

        EarthServerGenericClient.MainScene.reportProgress(index);
    };

    /**
     * The Scene Manager calls this function after a few frames since the last insertion of a chunk.
     */
    this.nextFrame = function()
    {
        try
        {
            //Build all necessary information and values to create a chunk
            var info = this.createChunkInfo(this.index,chunkSize,chunkInfo,currentChunk,data.width,data.height);
            var hm = this.getHeightMap(info);
            var appearance = this.getAppearances("TerrainApp_"+index,3,index,this.canvasTexture,
                data.transparency,this.data.specularColor,this.data.diffuseColor);

            var transform = document.createElement('Transform');
            transform.setAttribute("translation", info.xpos + " 0 " + info.ypos);
            transform.setAttribute("scale", "1.0 1.0 1.0");

            var lodNode = document.createElement('LOD');
            lodNode.setAttribute("Range", lodRange1 + ',' + lodRange2);
            lodNode.setAttribute("id", 'lod' + info.ID);

            if( this.noData !== undefined || this.noDemValue != undefined)
            {   new GapGrid(lodNode,info, hm, appearance,this.noDemValue, this.minVertexCount); }
            else
            {   new ElevationGrid(lodNode,info, hm, appearance);  }

            transform.appendChild(lodNode);
            root.appendChild(transform);

            currentChunk++;
            //Delete vars avoid circular references
            info = null;
            hm = null;
            appearance = null;
            transform = null;
            lodNode = null;
        }
        catch(error)
        {
            alert('Terrain::CreateNewChunk(): ' + error);
        }
    };
};
EarthServerGenericClient.LODTerrain.inheritsFrom( EarthServerGenericClient.AbstractTerrain);

/**
 * @class This terrain builds a plane with sharad data.
 * @param root - Dom Element to append the terrain to.
 * @param data - Received Data of the Server request.
 * @param index - Index of the model that uses this terrain.
 * @param noData - Array with RGB value to be considered NODATA and shall be transparent.
 * @param coordinates - Coordinates of the single data points.
 * @param area - Area of interest in which the sharad data points are inserted.
 * @augments EarthServerGenericClient.AbstractTerrain
 * @constructor
 */
EarthServerGenericClient.SharadTerrain = function(root,data,index,noData,coordinates,area)
{
    this.materialNodes = [];//Stores the IDs of the materials to change the transparency.
    this.data = data;
    this.index = index;

    /**
     * The canvas that holds the received image.
     * @type {HTMLElement}
     */
   this.canvasTexture   = this.createCanvas( data.texture,index,noData,data.removeAlphaChannel);

    /**
     * Builds the terrain and appends it into the scene.
     */
    this.createTerrain = function()
    {
        var appearance = this.getAppearances("TerrainApp_"+this.index,1,this.index,this.canvasTexture,
            data.transparency,this.data.specularColor,this.data.diffuseColor,true);
        var shape = document.createElement("shape");

        var indexedFaceSet = document.createElement('IndexedFaceSet');
        indexedFaceSet.setAttribute("colorPerVertex", "false");

        indexedFaceSet.setAttribute("solid","false");
        var coords = document.createElement('Coordinate');
        var points= "";
        var index = "";

        // No coordinates specified. Create simple plane
        if(coordinates === undefined || area.minx === undefined || area.miny === undefined || area.maxx === undefined || area.maxy === undefined)
        {
            var sizeX = this.canvasTexture.width;
            var sizeZ = this.canvasTexture.height;

            index = "0 1 2 3 -1";
            var p = {};
            p[0] = "0 0 0 ";
            p[1] = "0 0 "+ sizeZ + " ";
            p[2] = ""+ sizeX    + " 0 " + sizeZ + " ";
            p[3] = ""+ sizeX    + " 0 0";

            for(var i=0; i<4;i++)
            {   points = points+p[i];   }
        }
        else // Coordinates are specified. Build one face for every data point
        {
            // Set first quad index
            index = "0 1 3 2 -1 ";
            var height = Math.pow(2, Math.round(Math.log(data.texture.height)/Math.log(2)));
            if( height > x3dom.caps.MAX_TEXTURE_SIZE) height = x3dom.caps.MAX_TEXTURE_SIZE;

            // add vertices and indices for the quads
            for(var k=0; k<coordinates.length;k++)
            {
                // Get geo position of the data point
                var x = coordinates[k][0];
                var y = coordinates[k][1];
                // Transform them into cube coordinates
                var pos   = EarthServerGenericClient.MainScene.getCubePositionForPoint(this.index,x,y,area);


                if(pos.valid)
                {
                    // Add position to points
                    points = points + (pos.x) + " " + (pos.y+height) + " " + (pos.z) +" ";
                    points = points + (pos.x) + " " + (pos.y) + " " + (pos.z) + " ";
                    if(k!==0 && k<coordinates.length-1)
                    {
                        var mult = k*2;
                        index = index + (mult+1) + " " + mult + " " + (mult+2) + " " + (mult+3) + " -1 ";
                    }
                }
            }
        }

        coords.setAttribute("point", points);
        indexedFaceSet.setAttribute("coordindex",index);
        indexedFaceSet.appendChild(coords);
        shape.appendChild(appearance[0]);
        shape.appendChild(indexedFaceSet);

        root.appendChild(shape);

        shape = null;
        indexedFaceSet = null;
        appearance = null;
        coords = null;

        EarthServerGenericClient.MainScene.reportProgress(this.index);
    };


};
EarthServerGenericClient.SharadTerrain.inheritsFrom( EarthServerGenericClient.AbstractTerrain);

/**
 * Terrain to display multiple layers.
 * @param root - Dom Element to append the terrain to.
 * @param dataArray - Received Data array of the Server requests.
 * @param index - Index of the model that uses this terrain.
 * @param noDataValue - No Data Value
 * @constructor
 */
EarthServerGenericClient.VolumeTerrain = function(root,dataArray,index,noDataValue)
{
    this.materialNodes = [];//Stores the IDs of the materials to change the transparency.
    this.data = dataArray;
    this.index = index;
    this.noData = noDataValue;
    this.appearances = [];  // appearances of the layers
    this.canvasTextures = []; // canvas textures of the layers
    this.focus = 0;//parseInt( dataArray.length / 2 ) +1;

    //create canvas textures and appearances
    for(var i=0; i<dataArray.length;i++)
    {
        this.canvasTextures.push( this.createCanvas( dataArray[i].texture,index,noDataValue,dataArray[i].removeAlphaChannel) );
        this.appearances.push( this.getAppearances("TerrainApp_"+this.index+i,1,this.index,this.canvasTextures[i],
            dataArray[i].transparency,dataArray[i].specularColor,dataArray[i].diffuseColor) );
    }

    // create planes with textures
    for(i=0; i<dataArray.length;i++)
    {
        //(root, appearance, shapeNumber, yTranslation)
        this.createPlaneWithMaterial(root,this.appearances[i][0], i,i);
    }

    /**
     * Updates the number of layers to be shown.
     * @param value - Number of layers.
     */
    this.updateMaxShownElements = function(value)
    {
        this.setDrawnElements(value,this.focus);
    };
};
EarthServerGenericClient.VolumeTerrain.inheritsFrom( EarthServerGenericClient.AbstractTerrain);

/**
 * Terrain to display multiple layers.
 * @param root - Dom Element to append the terrain to.
 * @param data - Received Data of the Server request.
 * @param index - Index of the model that uses this terrain.
 * @param pointSize - Size of the points.
 * @constructor
 */
EarthServerGenericClient.PointCloudTerrain = function(root,data,index,pointSize)
{
    this.materialNodes = [];//Stores the IDs of the materials to change the transparency.
    this.appearance = null;  // appearance
    this.data = data;
    this.index = index;
    this.pointSize = parseFloat(pointSize);
    // Shader fields IDs for various attributes
    this.transparencyFieldID = "EarthServerGenericClient_model_"+index+"_transparencyField";
    this.pointSizeFieldID    = "EarthServerGenericClient_model_"+index+"_pointSizeField";
    this.lightPosID          = "EarthServerGenericClient_model_"+index+"_lightPosField";
    this.lightColorID        = "EarthServerGenericClient_model_"+index+"_lightColorField";

    this.createTerrain = function()
    {
        // create material
        this.appearance = document.createElement("Appearance");

        // create shape,PointSet, etc.
        var shape = document.createElement("Shape");
        var pointSet = document.createElement("PointSet");
        pointSet.setAttribute("solid","false");
        var coords = document.createElement("coordinate");
        coords.setAttribute("point", data.pointCloudCoordinates);
        var color = document.createElement("color");
        color.setAttribute("color", data.vertexColors );

        pointSet.appendChild(coords);
        pointSet.appendChild(color);
        this.appendShader( this.appearance);
        shape.appendChild(this.appearance);
        shape.appendChild(pointSet);
        root.appendChild(shape);

        coords = null;
        pointSet = null;
        shape = null;
        this.appearance = null;

        EarthServerGenericClient.MainScene.reportProgress(index);
        EarthServerGenericClient.MainScene.addLightObserver( this.index );
    };

    this.appendShader = function(domElement)
    {
        var cShader = document.createElement("composedShader");
        var field1  = document.createElement("field");
        field1.setAttribute("name","matCol");
        field1.setAttribute("type","SFVec3f");
        field1.setAttribute("value",data.diffuseColor);
        cShader.appendChild(field1);
        var field2  = document.createElement("field");
        field2.setAttribute("id", this.transparencyFieldID);
        field2.setAttribute("name","transparency");
        field2.setAttribute("type","SFFloat");
        field2.setAttribute("value",String(1.0 - data.transparency) );
        cShader.appendChild(field2);
        var field3  = document.createElement("field");
        field3.setAttribute("id", this.pointSizeFieldID);
        field3.setAttribute("name","pointSize");
        field3.setAttribute("type","SFFloat");
        field3.setAttribute("value",String(this.pointSize.toFixed(2)) );
        cShader.appendChild(field3);

        var field4  = document.createElement("field");
        field4.setAttribute("id", this.lightPosID);
        field4.setAttribute("name","lightPos");
        field4.setAttribute("type","SFVec3f");
        field4.setAttribute("value",EarthServerGenericClient.MainScene.getLightPosition(0) );
        cShader.appendChild(field4);
        var field5  = document.createElement("field");
        field5.setAttribute("id", this.lightColorID);
        field5.setAttribute("name","lightColor");
        field5.setAttribute("type","SFVec3f");
        field5.setAttribute("value",EarthServerGenericClient.MainScene.getLightColor(0) );
        cShader.appendChild(field5);

        var vertexCode = "attribute vec3 position; \n";
        vertexCode += "attribute vec3 color; \n";
        vertexCode += "uniform mat4 modelViewProjectionMatrix; \n";
        vertexCode += "uniform mat4 projectionMatrix; \n";
        vertexCode += "uniform float pointSize; \n";
        vertexCode += "uniform vec3 lightPos; \n";
        vertexCode += "varying vec3 vPos; \n";
        vertexCode += "varying vec3 vCol; \n";
        vertexCode += "varying vec3 vertex_to_light_vector; \n";
        vertexCode += "void main() { \n";
        vertexCode += "vCol = color; \n";
        vertexCode += "vPos = vec3(modelViewProjectionMatrix * vec4(position, 1.0)); \n";
        vertexCode += "gl_Position = modelViewProjectionMatrix * vec4(position, 1.0); \n";
        vertexCode += "vertex_to_light_vector = vec3(lightPos - vPos); \n";
        vertexCode += "gl_PointSize = pointSize; } \n";

        var shaderPartVertex = document.createElement("shaderPart");
        shaderPartVertex.setAttribute("type","VERTEX");
        shaderPartVertex.innerHTML = vertexCode;
        cShader.appendChild(shaderPartVertex);

        var fragmentCode = "#ifdef GL_FRAGMENT_PRECISION_HIGH \n";
        fragmentCode += "precision highp float; \n";
        fragmentCode += "#else \n";
        fragmentCode += "precision mediump float; \n";
        fragmentCode += "#endif \n";
        fragmentCode += "uniform vec3 matCol; \n";
        fragmentCode += "uniform float transparency; \n";
        fragmentCode += "uniform vec3 lightPos; \n";
        fragmentCode += "uniform vec3 lightColor; \n";
        fragmentCode += "varying vec3 vPos; \n";
        fragmentCode += "varying vec3 vCol; \n";
        fragmentCode += "varying vec3 vertex_to_light_vector; \n";
        fragmentCode += "void main() { \n";
        fragmentCode += "vec3 normalized_vertex_to_light_vector = normalize(vertex_to_light_vector); \n";
        fragmentCode += "float DiffuseTerm = clamp(dot(vec3(0.0, 1.0, 0.0), normalized_vertex_to_light_vector), 0.0, 1.0); \n";
        fragmentCode += "gl_FragColor = vec4(vCol*DiffuseTerm, transparency); } \n";
        //fragmentCode += "gl_FragColor = vec4(vCol, transparency); } \n";


        var shaderPartFragment = document.createElement("shaderPart");
        shaderPartFragment.setAttribute("type","FRAGMENT");
        shaderPartFragment.innerHTML = fragmentCode;
        cShader.appendChild(shaderPartFragment);

        domElement.appendChild( cShader );

        cShader = null;
        field1 = null;
        field2 = null;
        field3 = null;
        field4 = null;
        field5 = null;
        shaderPartVertex = null;
        shaderPartFragment = null;
    };

    /**
     * Overwrites function from base terrain class. Sets the transparency in the shader.
     * @param value - Transparency value between 0 (full visible) and 1 (invisible).
     */
    this.setTransparency = function(value)
    {
        var transparencyField = document.getElementById( this.transparencyFieldID);

        if( transparencyField )
            transparencyField.setAttribute("value", String(1.0-value) );
        else
            console.log("EarthServerGenericClient.PointCloudTerrain: Can't find transparency field.")
    };

    /**
     * Sets the size of the drawn points.
     * @param value - Size if the points.
     */
    this.setPointSize = function(value)
    {
        var pointSizeField = document.getElementById( this.pointSizeFieldID );

        if( pointSizeField)
            pointSizeField.setAttribute("value", String(value));
        else
            console.log("EarthServerGenericClient.PointCloudTerrain: Can't find point size field.")
    };

    /**
     * Callback function when the light was changed.
     * @param lightElement
     */
    this.lightUpdate = function(lightElement)
    {
        var position = lightElement.getAttribute("location");
        this.setLightPosition(position);
    };

    /**
     * Sets the position of the light source effecting the point cloud.
     * @param lightPosition - Position of light source.
     */
    this.setLightPosition = function(lightPosition)
    {
        var lightPosField = document.getElementById( this.lightPosID);

        if( lightPosField)
           lightPosField.setAttribute("value",String(lightPosition));
        else
            console.log("EarthServerGenericClient.PointCloudTerrain: Can't find light position field.")
    };
};
EarthServerGenericClient.PointCloudTerrain.inheritsFrom( EarthServerGenericClient.AbstractTerrain);

EarthServerGenericClient.TimeProgressTerrain = function(root,data,index,layers,hours)
{
    this.materialNodes  = [];//Stores the IDs of the materials to change the transparency.
    this.canvasTextures = [];
    this.appearances    = [];
    this.planes         = [];
    this.data   = data;
    this.index  = index;
    this.layers = layers;
    this.hours  = hours;

    var hoursProcessed = 0; // counter for the materials to be inserted into the dom.
    var transforms = [];

    /**
     * Builds the terrain and appends it into the scene.
     */
    this.createTerrain= function()
    {
        // insert all layers with the first texture now. In nextFrame() all the other textures/materials.
        for(var i=0; i< this.layers; i++)
        {
            var canvasIndex = "" + this.index + "_" + i;
            this.canvasTextures.push( this.createCanvas( this.data[i].texture,canvasIndex,undefined,this.data[i].removeAlphaChannel) );
            this.appearances.push( this.getAppearances("TerrainApp_"+this.index+i,1,this.index,this.canvasTextures[i],
                this.data[i].transparency,this.data[i].specularColor,this.data[i].diffuseColor) );
            // create planes with texture
            transforms.push( this.createPlaneWithMaterial(root,this.appearances[i][0],i,i) );
            EarthServerGenericClient.MainScene.reportProgress(this.index);
        }

        hoursProcessed++;
    };

    /**
     * The Scene Manager calls this function after a few frames since the last insertion of a chunk.
     */
    this.addNextHour = function(patch)
    {
        try
        {
            for(var o=0; o<patch.length;o++)
            {
                this.data.push( patch[o]);
            }

            // create additional canvases
            for(var i=0; i< this.layers; i++)
            {
                var materialIndex = ( hoursProcessed*this.layers ) + i;
                var canvasIndex = "" + this.index + "_" + materialIndex;

                this.canvasTextures.push( this.createCanvas( this.data[materialIndex].texture,canvasIndex,undefined,this.data[materialIndex].removeAlphaChannel) );
                this.appearances.push( this.getAppearances("TerrainApp_"+this.index+materialIndex,1,this.index,this.canvasTextures[materialIndex],
                    this.data[materialIndex].transparency,this.data[materialIndex].specularColor,this.data[materialIndex].diffuseColor) );
                // create planes with texture
                transforms.push( this.createPlaneWithMaterial(root,this.appearances[materialIndex][0],i,i) );
                transforms[materialIndex].setAttribute("render","false");
                EarthServerGenericClient.MainScene.reportProgress(this.index);
            }

            hoursProcessed++;
        }
        catch(error)
        {
            alert('TimeProgressTerrain::NextFrame(): ' + error);
        }
    };

    this.updateUsedMaterial = function(value)
    {
        if( value >= hoursProcessed)
        {
            console.log("TimeProgressTerrain::updateUsedMaterial: " + value + " is not a loaded time.");
            return;
        }

        for(var i=0; i< transforms.length; i++)
        {
            transforms[i].setAttribute("render","false");
        }

        for( i=0; i< this.layers; i++)
        {
            var index = (this.layers*value) +i;
            transforms[index].setAttribute("render","true");
        }
    };

    this.getMinDataValueAtAxis = function(axis)
    {
        return 0;
    }

};
EarthServerGenericClient.TimeProgressTerrain.inheritsFrom( EarthServerGenericClient.AbstractTerrain);
