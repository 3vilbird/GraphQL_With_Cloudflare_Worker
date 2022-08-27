import { stitchSchemas } from '@graphql-tools/stitch';
import {TeacherSubschema} from "./TeacherSchema";
import {SchoolSubschema} from "./SchoolSchema";
import {PupilSchemaSubschema} from "./PupilSchema";


// build the combined schema
export const gatewaySchema = stitchSchemas({
    subschemas: [      
      TeacherSubschema,
      SchoolSubschema,
      PupilSchemaSubschema
    ]
  });