# supply_gate_26514
Supply Gate - Backend Service
A robust Spring Boot backend for a trusted B2B marketplace connecting businesses with verified manufacturers and suppliers.

 Overview
RESTful API service providing core marketplace functionality including user management, supplier verification, product catalog, and quotation system.

 Tech Stack
Framework: Spring Boot 3.x

Database: PostgreSQL

ORM: Spring Data JPA

Validation: Spring Validation

Documentation: Springdoc OpenAPI

 Quick Start
Prerequisites:

Java 17+

PostgreSQL 13+

Maven 3.6+

 API Documentation
Once running, you can access the API docs at:
Swagger UI: http://localhost:8080/swagger-ui.html

 Key Features

Supplier verification workflow

Product catalog management

ERD Diagram
[CLASS d2.drawio](https://github.com/user-attachments/files/23246213/CLASS.d2.drawio)
[Upload<mxfile host="app.diagrams.net" agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36" version="28.2.8">
  <diagram id="CO36ZFtTlNgLKsZtoTIG" name="Page-1">
    <mxGraphModel dx="2108" dy="1135" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="850" pageHeight="1100" background="none" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="node2" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;background-color:#87CEEB;padding:8px;&quot;&gt;&lt;b&gt;administrative_structure&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; parent_id: uuid&lt;br/&gt; structure_code: varchar(255)&lt;br/&gt; structure_name: varchar(255)&lt;br/&gt; structure_type: varchar(255)&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; structure_id: uuid&lt;/p&gt;" style="verticalAlign=top;align=left;overflow=fill;fontSize=14;fontFamily=Helvetica;html=1;rounded=0;shadow=0;comic=0;labelBackgroundColor=none;strokeWidth=1;" parent="1" vertex="1">
          <mxGeometry x="44" y="-140" width="242" height="180" as="geometry" />
        </mxCell>
        <mxCell id="node0" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;background-color:#87CEEB;padding:8px;&quot;&gt;&lt;b&gt;categories&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; category_name: varchar(255)&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; category_id: uuid&lt;/p&gt;" style="verticalAlign=top;align=left;overflow=fill;fontSize=14;fontFamily=Helvetica;html=1;rounded=0;shadow=0;comic=0;labelBackgroundColor=none;strokeWidth=1;" parent="1" vertex="1">
          <mxGeometry x="-120" y="536" width="211" height="114" as="geometry" />
        </mxCell>
        <mxCell id="node3" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;background-color:#87CEEB;padding:8px;&quot;&gt;&lt;b&gt;product_images&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; product_id: uuid&lt;br/&gt; image_url: varchar(255)&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; image_id: uuid&lt;/p&gt;" style="verticalAlign=top;align=left;overflow=fill;fontSize=14;fontFamily=Helvetica;html=1;rounded=0;shadow=0;comic=0;labelBackgroundColor=none;strokeWidth=1;" parent="1" vertex="1">
          <mxGeometry x="-82" y="1124" width="175" height="136" as="geometry" />
        </mxCell>
        <mxCell id="node6" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;background-color:#87CEEB;padding:8px;&quot;&gt;&lt;b&gt;products&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; product_price: double precision&lt;br/&gt; creation_date: timestamp(6)&lt;br/&gt; category_id: uuid&lt;br/&gt; store_id: uuid&lt;br/&gt; product_description: varchar(255)&lt;br/&gt; product_name: varchar(255)&lt;br/&gt; quantity: varchar(255)&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; product_id: uuid&lt;/p&gt;" style="verticalAlign=top;align=left;overflow=fill;fontSize=14;fontFamily=Helvetica;html=1;rounded=0;shadow=0;comic=0;labelBackgroundColor=none;strokeWidth=1;" parent="1" vertex="1">
          <mxGeometry x="-75" y="764" width="241" height="246" as="geometry" />
        </mxCell>
        <mxCell id="node4" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;background-color:#87CEEB;padding:8px;&quot;&gt;&lt;b&gt;reviews&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; creation_date: timestamp(6)&lt;br/&gt; product_id: uuid&lt;br/&gt; user_id: uuid&lt;br/&gt; message: varchar(255)&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; review_id: uuid&lt;/p&gt;" style="verticalAlign=top;align=left;overflow=fill;fontSize=14;fontFamily=Helvetica;html=1;rounded=0;shadow=0;comic=0;labelBackgroundColor=none;strokeWidth=1;" parent="1" vertex="1">
          <mxGeometry x="123" y="1100" width="204" height="180" as="geometry" />
        </mxCell>
        <mxCell id="node5" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;background-color:#87CEEB;padding:8px;&quot;&gt;&lt;b&gt;stores&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; creation_date: timestamp(6)&lt;br/&gt; user_id: uuid&lt;br/&gt; phone_number: varchar(255)&lt;br/&gt; store_email: varchar(255)&lt;br/&gt; store_name: varchar(255)&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; store_id: uuid&lt;/p&gt;" style="verticalAlign=top;align=left;overflow=fill;fontSize=14;fontFamily=Helvetica;html=1;rounded=0;shadow=0;comic=0;labelBackgroundColor=none;strokeWidth=1;" parent="1" vertex="1">
          <mxGeometry x="140" y="488" width="210" height="202" as="geometry" />
        </mxCell>
        <mxCell id="node1" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;background-color:#87CEEB;padding:8px;&quot;&gt;&lt;b&gt;users&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; creation_date: timestamp(6)&lt;br/&gt; location_id: uuid&lt;br/&gt; email: varchar(255)&lt;br/&gt; first_name: varchar(255)&lt;br/&gt; last_name: varchar(255)&lt;br/&gt; password: varchar(255)&lt;br/&gt; phone_number: varchar(255)&lt;br/&gt; user_type: varchar(255)&lt;br/&gt; username: varchar(255)&lt;/p&gt;&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0 0 0 4px;line-height:1.6;&quot;&gt; user_id: uuid&lt;/p&gt;" style="verticalAlign=top;align=left;overflow=fill;fontSize=14;fontFamily=Helvetica;html=1;rounded=0;shadow=0;comic=0;labelBackgroundColor=none;strokeWidth=1;" parent="1" vertex="1">
          <mxGeometry x="120" y="100" width="210" height="300" as="geometry" />
        </mxCell>
        <mxCell id="edge5" value="" style="html=1;rounded=1;edgeStyle=orthogonalEdgeStyle;dashed=0;startArrow=none;endArrow=block;endSize=12;strokeColor=#595959;exitX=0.500;exitY=0.000;exitDx=0;exitDy=0;entryX=1.000;entryY=0.500;entryDx=0;entryDy=0;" parent="1" source="node2" target="node2" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="165" y="-157" />
              <mxPoint x="390" y="-157" />
              <mxPoint x="390" y="-60" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="label32" value="1" style="edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;strokeColor=default;fontSize=12;fontStyle=1;" parent="edge5" vertex="1" connectable="0">
          <mxGeometry x="286" y="-70" as="geometry" />
        </mxCell>
        <mxCell id="label33" value="0..*" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=bottom;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge5">
          <mxGeometry x="165" y="-150" as="geometry" />
        </mxCell>
        <mxCell id="label34" value="parent_id:structure_id" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;" connectable="0" vertex="1" parent="edge5">
          <mxGeometry x="348" y="-131" as="geometry" />
        </mxCell>
        <mxCell id="edge7" value="" style="html=1;rounded=1;edgeStyle=orthogonalEdgeStyle;dashed=0;startArrow=none;endArrow=block;endSize=12;strokeColor=#595959;exitX=0.500;exitY=0.000;exitDx=0;exitDy=0;entryX=0.500;entryY=1.000;entryDx=0;entryDy=0;" parent="1" source="node3" target="node6" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="5" y="1048" />
              <mxPoint x="45" y="1048" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="label43" value="0..*" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge7">
          <mxGeometry x="5" y="1114" as="geometry" />
        </mxCell>
        <mxCell id="label44" value="product_id" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;" parent="edge7" vertex="1" connectable="0">
          <mxGeometry x="-20" y="1084" as="geometry" />
        </mxCell>
        <mxCell id="edge6" value="" style="html=1;rounded=1;edgeStyle=orthogonalEdgeStyle;dashed=0;startArrow=none;endArrow=block;endSize=12;strokeColor=#595959;exitX=0.251;exitY=0.000;exitDx=0;exitDy=0;entryX=0.500;entryY=1.000;entryDx=0;entryDy=0;" parent="1" source="node6" target="node0" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <Array as="points" />
          </mxGeometry>
        </mxCell>
        <mxCell id="label36" value="1" style="edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge6">
          <mxGeometry x="-15" y="641" as="geometry">
            <mxPoint x="15" y="40" as="offset" />
          </mxGeometry>
        </mxCell>
        <mxCell id="label37" value="0..*" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge6">
          <mxGeometry x="-15" y="754" as="geometry" />
        </mxCell>
        <mxCell id="label38" value="category_id" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;" parent="edge6" vertex="1" connectable="0">
          <mxGeometry x="-48" y="690" as="geometry" />
        </mxCell>
        <mxCell id="edge3" value="" style="html=1;rounded=1;edgeStyle=orthogonalEdgeStyle;dashed=0;startArrow=none;endArrow=block;endSize=12;strokeColor=#595959;exitX=0.969;exitY=0.000;exitDx=0;exitDy=0;entryX=0.086;entryY=1.000;entryDx=0;entryDy=0;" parent="1" source="node6" target="node5" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <Array as="points" />
          </mxGeometry>
        </mxCell>
        <mxCell id="label18" value="1" style="edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge3">
          <mxGeometry x="150" y="682" as="geometry">
            <mxPoint x="27" y="26" as="offset" />
          </mxGeometry>
        </mxCell>
        <mxCell id="label19" value="0..*" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge3">
          <mxGeometry x="158" y="754" as="geometry" />
        </mxCell>
        <mxCell id="label20" value="store_id" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;" parent="edge3" vertex="1" connectable="0">
          <mxGeometry x="130" y="708" as="geometry" />
        </mxCell>
        <mxCell id="edge1" value="" style="html=1;rounded=1;edgeStyle=orthogonalEdgeStyle;dashed=0;startArrow=none;endArrow=block;endSize=12;strokeColor=#595959;exitX=0.500;exitY=0.000;exitDx=0;exitDy=0;entryX=0.500;entryY=1.000;entryDx=0;entryDy=0;" parent="1" source="node4" target="node6" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="225" y="1048" />
              <mxPoint x="45" y="1048" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="label6" value="1" style="edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge1">
          <mxGeometry x="45" y="1006" as="geometry">
            <mxPoint x="9" y="21" as="offset" />
          </mxGeometry>
        </mxCell>
        <mxCell id="label7" value="0..*" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge1">
          <mxGeometry x="225" y="1090" as="geometry" />
        </mxCell>
        <mxCell id="label8" value="product_id" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;" parent="edge1" vertex="1" connectable="0">
          <mxGeometry x="151" y="1038" as="geometry" />
        </mxCell>
        <mxCell id="edge0" value="" style="html=1;rounded=1;edgeStyle=orthogonalEdgeStyle;dashed=0;startArrow=none;endArrow=block;endSize=12;strokeColor=#595959;exitX=1.000;exitY=0.700;exitDx=0;exitDy=0;entryX=1.000;entryY=0.700;entryDx=0;entryDy=0;" parent="1" source="node4" target="node1" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="430" y="1212" />
              <mxPoint x="430" y="296" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="label0" value="1" style="edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge0">
          <mxGeometry x="340" y="306" as="geometry" />
        </mxCell>
        <mxCell id="label1" value="0..*" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge0">
          <mxGeometry x="337" y="1202" as="geometry" />
        </mxCell>
        <mxCell id="label2" value="user_id" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;" parent="edge0" vertex="1" connectable="0">
          <mxGeometry x="420" y="800" as="geometry" />
        </mxCell>
        <mxCell id="edge2" value="" style="html=1;rounded=1;edgeStyle=orthogonalEdgeStyle;dashed=0;startArrow=none;endArrow=block;endSize=12;strokeColor=#595959;exitX=1.000;exitY=0.300;exitDx=0;exitDy=0;entryX=1.000;entryY=0.300;entryDx=0;entryDy=0;" parent="1" source="node5" target="node1" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="390" y="543" />
              <mxPoint x="390" y="184" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="label12" value="1" style="edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge2">
          <mxGeometry x="340" y="194" as="geometry" />
        </mxCell>
        <mxCell id="label13" value="0..*" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge2">
          <mxGeometry x="360" y="533" as="geometry" />
        </mxCell>
        <mxCell id="label14" value="user_id" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;" parent="edge2" vertex="1" connectable="0">
          <mxGeometry x="370" y="350" as="geometry" />
        </mxCell>
        <mxCell id="edge4" value="" style="html=1;rounded=1;edgeStyle=orthogonalEdgeStyle;dashed=0;startArrow=none;endArrow=block;endSize=12;strokeColor=#595959;exitX=0.214;exitY=0.000;exitDx=0;exitDy=0;entryX=0.500;entryY=1.000;entryDx=0;entryDy=0;" parent="1" source="node1" target="node2" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <Array as="points" />
          </mxGeometry>
        </mxCell>
        <mxCell id="label24" value="1" style="edgeLabel;resizable=0;html=1;align=right;verticalAlign=bottom;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge4">
          <mxGeometry x="165" y="-10" as="geometry">
            <mxPoint x="18" y="76" as="offset" />
          </mxGeometry>
        </mxCell>
        <mxCell id="label25" value="0..*" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;fontSize=12;fontStyle=1;" connectable="0" vertex="1" parent="edge4">
          <mxGeometry x="165" y="90" as="geometry" />
        </mxCell>
        <mxCell id="label26" value="location_id:structure_id" style="edgeLabel;resizable=0;html=1;align=left;verticalAlign=top;strokeColor=default;" parent="edge4" vertex="1" connectable="0">
          <mxGeometry x="99" y="141" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
ing CLASS d2.drawio…]()


